import Request from "../request/request.schema";
import Product from "../product/product.schema";
import fileDelete from "../../utils/fileDelete";
import fileUpload from "../../utils/fileUpload";
import randomId from "../../utils/randomId";
import mongoose from "mongoose";
import User from "../user/user.schema";
import shippingAddress from "../user/shipping.schema";
import trxId from "../../utils/trxId";
const ObjectId = mongoose.Types.ObjectId;

/**
 * these set are use to validate the request item information
 */
// const createAllowed = new Set({
//   product: [],
//   request: ["quantity", "note" ]
// });
// const createAllowed = new Map([]);
const updateAllowed = new Set([
  "quantity",
  "note",
  "status",
  "seller_takes",
  "sales_taxs",
  "packers_fee",
  "shipping_fee",
  "grandTotal",
  "aprox_delivery",
]);
const allowedQuery = new Set([
  "user",
  "requestId",
  "product",
  "_id",
  "status",
  "search",
  "page",
  "limit",
  "id",
  "paginate",
]);

/**
 * create new product request
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the new cretated product request object
 */
export const create =
  ({ db, imageUp }) =>
  async (req, res) => {
    try {
      // validate only alowed properties are inserted
      const validProduct = Object.keys(req.body.product).every((k) =>
        new Set(["name", "link", "images"]).has(k)
      );
      if (!validProduct)
        return res.status(400).send("Bad request, Validation failed");

      const validRequest = Object.keys(req.body.request).every((k) =>
        new Set(["quantity", "note"]).has(k)
      );
      if (!validRequest)
        return res.status(400).send("Bad request, Validation failed");

      // upload all products images
      if (req?.files && Object.keys(req?.files).length > 0) {
        req.body.product.images = await fileUpload(req.files.images, imageUp);
      }

      // insert data in product table
      const product = await db.create({
        table: Product,
        key: req.body.product,
      });

      // insert data in request table
      const request = await db.create({
        table: Request,
        key: {
          requestId: randomId(),
          user: req.user._id,
          product: product._id,
          ...req.body.request,
        },
      });

      res.status(200).send({ product, request });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  };

/**
 * create existing product request
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the existing product request object
 */
export const createExist =
  ({ db }) =>
  async (req, res) => {
    try {
      // check product id is valid
      if (!ObjectId.isValid(req.body.product))
        return res.status(400).send("Invalid Product Id");

      // validate only alowed properties are inserted
      const valid = Object.keys(req.body).every((k) =>
        new Set(["quantity", "note", "product"]).has(k)
      );
      if (!valid) return res.status(400).send("Bad request, Validation failed");

      // insert data in request table
      const request = await db.create({
        table: Request,
        key: { requestId: randomId(), user: req.user._id, ...req.body },
      });

      res.status(200).send(request);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  };

/**
 * create existing product request
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the existing product request object
 */
export const requestCheckout = () => async (req, res) => {
  try {
    // get user chekout information
    const request = await getUserCheckoutInfo({
      Table: Request,
      match: { user: req.user._id, status: "estimate-send" },
    });

    res.status(200).send(request);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

/**
 * initiate checkout request
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the existing product request object
 */
export const initiatePaymentCheckout =
  ({ db, payment }) =>
  async (req, res) => {
    try {
      // add shipping address
      db.create({
        table: shippingAddress,
        key: req.body.shippingAddress,
      }).then(async (shipping) => {
        const user = await db.findOne({
          table: User,
          key: { _id: req.user._id },
        });
        user.shippingAddress = shipping._id;
        db.save(user);
      });

      // get user chekout information
      const request = await getUserCheckoutInfo({
        Table: Request,
        match: { user: req.user._id, status: "estimate-send" },
      });

      // calculate total amount
      const totalAmmount =
        request.reduce((total, item) => total + item.totalAmmount, 0) +
        (req.body.inside_dhaka ? 100 : 150);

      // initiate payment
      const paymentData = await payment.initiatePayment({
        total_amount: totalAmmount,
        currency: "BDT",
        tran_id: "trxId()",
        product_category: "General",
        success_url: "success.html",
        cancel_url: "cancel.html",
        fail_url: "fail.html",
        ipn_url: `${process.env.CLIENT_URL}/checkout/ipn`,
        product_name: request[0].product.name || "",
        product_category: "General",
        product_profile: "General",
        cus_name: request[0].user.full_name || "",
        cus_email: request[0].user.email || "",
        cus_add1: request[0].user.shippingAddress.address || "",
        cus_city: request[0].user.shippingAddress.cit || "",
        cus_state: request[0].user.shippingAddress.area || "",
        cus_postcode: request[0].user.shippingAddress.zip || "",
        cus_country: request[0].user.shippingAddress.city || "",
        cus_phone: request[0].user.phone || "",
        shipping_method: "No",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
        // value_a: user,
        // value_b: note,
        // value_c: email,
      });

      console.log(paymentData);

      res.status(200).send({ paymentData, request });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  };

/**
 * get user checkout information
 * @param { Object } Table is request collection instance
 * @param { Object } match is query object
 * @returns { Object } returns user cart information
 */
export async function getUserCheckoutInfo({ Table, match }) {
  return await Table.aggregate([
    { $match: { ...match } },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $lookup: {
        from: "categories",
        localField: "product.category",
        foreignField: "_id",
        as: "product.category",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $addFields: {
        productPrice: {
          $multiply: ["$product.price", "$quantity"],
        },
      },
    },
    {
      $addFields: {
        totalAmmount: {
          $sum: [
            "$seller_takes",
            "$sales_taxs",
            "$packers_fee",
            "$discountAmount",
            "$productPrice",
          ],
        },
      },
    },
    {
      $project: {
        requestId: 1,
        "user.full_name": 1,
        "user.email": 1,
        "user.phone": 1,
        "user.shippingAddress": 1,
        "product.name": 1,
        "product.price": 1,
        "product.images": 1,
        "product.category.name": 1,
        quantity: 1,
        aprox_delivery: 1,
        totalAmmount: 1,
        productPrice: 1,
        packers_fee: 1,
        sales_taxs: 1,
        seller_takes: 1,
        discountAmount: 1,
      },
    },
  ]);
}

/**
 * get all request items
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the request item list
 */
export const getRequestItem =
  ({ db }) =>
  (req, res) => {
    try {
      db.find({
        table: Request,
        key: {
          allowedQuery,
          paginate: req.query.paginate === "true",
          populate: { path: "user product" },
        },
      })
        .then(async (request) => {
          res.status(200).send(request);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error: " + err.message);
        });
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };

/**
 * get single request item
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the single request item object
 */
export const getSingleRequest =
  ({ db }) =>
  (req, res) => {
    try {
      db.findOne({
        table: Request,
        key: {
          id: req.params.id,
          populate: { path: "user product" },
        },
      })
        .then(async (request) => {
          // const order = await db.find({
          //   table: Order,
          //   key: { id: req.user.id },
          // });
          res.status(200).send(request);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error: " + err.message);
        });
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };

/**
 * update request item
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the request object
 */
export const updateRequest =
  ({ db, imageUp }) =>
  async (req, res) => {
    try {
      // validate only updateAllowed properties
      const valid = Object.keys(req.body).every((k) => updateAllowed.has(k));
      if (!valid) return res.status(400).send("Bad request, Validation failed");

      // find request item
      const request = await db.findOne({
        table: Request,
        key: { id: req.params.id },
      });

      // check request is exist
      if (!request) return res.status(404).send("Invalid Request ID");

      // check if new files are uploaded then first delete previously uploaded product images and then upload new images
      if (Object.keys(req?.files).length > 0) {
        await fileDelete(request.product.images);
        const newImage = await fileUpload(req.files?.images, imageUp);
        await db.update({
          table: Product,
          key: request.product._id,
          body: { images: newImage },
        });
      }

      db.update({
        table: Request,
        key: {
          id: req.params.id,
          body: req.body,
          populate: { path: "user product" },
        },
      })
        .then((products) => {
          res.status(200).send(products);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error: " + err.message);
        });
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };

/**
 * delete request
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the sucesss message
 */
export const deleteRequest =
  ({ db }) =>
  async (req, res) => {
    try {
      db.remove({
        table: Request,
        key: { id: req.params.id },
      })
        .then((request) => {
          res.status(200).send({ message: "Deleted Successfully", request });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({ message: err.message });
        });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Something went wrong" });
    }
  };
