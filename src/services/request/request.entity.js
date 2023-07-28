import Request from "../request/request.schema";
import Product from "../product/product.schema";
import fileDelete from "../../utils/fileDelete";
import fileUpload from "../../utils/fileUpload";
import randomId from "../../utils/randomId";
import mongoose from "mongoose";
import User from "../user/user.schema";
import shippingAddress from "../user/shipping.schema";
import trxId from "../../utils/trxId";
import Payment from "../payment/payment.schema";
import Order from "../order/order.schema";
import productInvoice from "../../template/product-invoice";

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
  "link",
  "images",
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
      $lookup: {
        from: "shippingaddresses",
        localField: "user.shippingAddress",
        foreignField: "_id",
        as: "user.shippingAddress",
      },
    },
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
        from: "subcategories",
        localField: "product.sub_category",
        foreignField: "_id",
        as: "product.sub_category",
      },
    },
    {
      $addFields: {
        productPrice: {
          $multiply: ["$product.price", "$quantity"],
        },
      },
    },
  ]);
}

/**
 * initiate checkout request
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the existing product request object
 */
export const initiatePaymentCheckout =
  ({ db, payment, settings }) =>
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

      // generate request _id array for order.items field
      const orderItems = [];
      request.forEach((Item) => {
        orderItems.push(Item._id);
      });

      // calculate total amount
      const totalAmmount =
        request.reduce((total, item) => total + item.productPrice, 0) +
        (req.body.inside_dhaka ? 100 : 150);

      // console.log(request[0]);

      // initiate payment
      const paymentData = await payment.init({
        total_amount: totalAmmount,
        currency: "BDT",
        tran_id: "trxId()",
        product_category: "General",
        success_url: `${settings.hosturl}/checkout-success`,
        cancel_url: `${settings.hosturl}/checkout-cancel`,
        fail_url: `${settings.hosturl}/checkout-fail`,
        ipn_url: `checkout/ipn`,
        product_name: request[0].product.name || "",
        product_category: "General",
        product_profile: "General",
        cus_name: request[0].user.full_name || "",
        cus_email: request[0].user.email || "",
        cus_add1: request[0].user.shippingAddress.address || "",
        cus_city: request[0].user.shippingAddress.city || "",
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
        ship_postcode: 100000,
        ship_country: "Bangladesh",
        value_a: req.user._id.toString(),
        value_b: req.body.note,
        value_c: JSON.stringify(orderItems),
      });

      res.status(200).send({ url: paymentData.GatewayPageURL });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  };

/**
 * payment success callback
 * @param { Object } payment the payment object interacting with payment related operations
 * @param { Object } req the request object containing the properties when user successfully payment
 * @returns { Object } returns the existing product request object
 */
export const checkoutSuccess =
  ({ db, payment }) =>
  async (req, res) => {
    // console.log("success data", req.body);
    const validate = await payment.validate({ val_id: req.body.val_id });
    // console.log("validated", validate);

    const paymentData = await db.create({
      table: Payment,
      key: {
        user: validate.value_a,
        valid_id: validate.val_id,
        amount: validate.amount,
        bank_tran_id: validate.bank_tran_id,
        paymentMethod: validate.card_type,
        paymentStatus:
          validate.status === "VALID" || "VALIDATED" ? "Paid" : "Unpaid",
        transactionId: validate.tran_id,
        transactionDate: validate.tran_date,
      },
    });

    const order = await db.create({
      table: Order,
      key: {
        user: validate.value_a,
        payment: paymentData._id,
        items: JSON.parse(validate.value_c),
        orderId: randomId(),
        note: validate.value_b,
      },
    });

    paymentData.order = order._id;
    db.save(paymentData);

    if (validate.status === "VALID" || "VALIDATED") {
      return res.redirect("https://google.com"); // redirect to success page
    }

    res.redirect("https://google.com"); // redirect to fail page
  };

/**
 * payment fail callback
 * @param { Object } payment the payment object interacting with payment related operations
 * @param { Object } req the request object containing the properties when user payment is failed
 * @returns { Object } returns the existing product request object
 */
export const checkoutFail =
  ({ payment }) =>
  async (req, res) => {
    console.log("fail data", req.body);
  };

/**
 * payment cancel callback
 * @param { Object } payment the payment object interacting with payment related operations
 * @param { Object } req the request object containing the properties when user payment is cancelled
 * @returns { Object } returns the existing product request object
 */
export const checkoutCancel =
  ({ payment }) =>
  async (req, res) => {
    console.log("cancel data", req.body);
  };

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
        },
      })
        .then(async (request) => {
          const order = await Order.countDocuments({ id: request.user.id });
          res.status(200).send({ request, order });
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

      // find the reqyuested product
      let product = await db.findOne({
        table: Product,
        key: { id: request.product._id },
      });

      // check if new files are uploaded then upload new images and update updatebase
      if (req?.files && Object.keys(req?.files).length > 0) {
        const newImage = await fileUpload(req.files?.images, imageUp);
        product.images.push(newImage);
      }

      if (req.body.link) {
        product.link = req.body.link;
        delete req.body.link;
      }
      product.price =
        parseInt(req.body?.seller_takes) +
        parseInt(req.body?.sales_taxs) +
        parseInt(req.body?.packers_fee);

      db.save(product);

      db.update({
        table: Request,
        key: {
          id: req.params.id,
          body: req.body,
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

/**
 * send request invoice
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the sucesss message
 */
export const sendRequestInvoice =
  ({ mail }) =>
  async (req, res) => {
    try {
      const request = await Request.findOne({ _id: req.params.id });

      if (!request) {
        return res.status(404).send({ message: "Request Item not found" });
      }

      if (request.status === "pending") {
        return res.status(200).send({
          message: "Please update sales takse, salse taxs, packer fee and",
        });
      }

      const template = productInvoice({
        name: request.product.name,
        requestID: request.requestId,
        seller_takes: request.seller_takes,
        sales_taxs: request.sales_taxs,
        packers_fee: request.packers_fee,
        quantity: request.quantity,
        delivery: request.aprox_delivery,
      });

      const sendMail = await mail({
        receiver: request.user.email,
        subject: "Requst Product Invoice",
        body: template,
        type: "html",
      });

      if (!sendMail)
        return res.status(500).send("Failed to send Request product invoice");
      res.status(200).send({ request, sendMail });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Something went wrong" });
    }
  };
