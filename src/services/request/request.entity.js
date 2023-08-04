import Request from "../request/request.schema";
import Product from "../product/product.schema";
import fileUpload from "../../utils/fileUpload";
import randomId from "../../utils/randomId";
import mongoose from "mongoose";
import Order from "../order/order.schema";
import productInvoice from "../../template/product-invoice";
import Cart from "../cart/cart.schema";
import { productPriceCalculate } from "../cart/cart.entity";

const ObjectId = mongoose.Types.ObjectId;

/**
 * these set are use to validate the request item information
 */
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
      if (req.files && Object.keys(req?.files).length > 0) {
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
 * update user request item quantity
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of cart
 * @returns { Object } returns the cart items list
 */
export const itemQuantityUpdate =
  ({ db }) =>
  async (req, res) => {
    try {
      const request = await Request.findOne({
        user: req.user._id,
        _id: req.body.requestId,
      });

      if (!request) return res.status(404).send("Request Not Found");
      if (req.body.quantity > 12 || request.quantity > 12) {
        return res.status(400).send("At a time Can't Order more than 12 items");
      }

      request.quantity = req.body.quantity;
      await request.save();

      const cart = await Cart.findOne({ user: request.user });

      if (cart.couponApplied) {
        return res
          .status(400)
          .send("Can't Update Item Quantity after applied coupon");
      }

      cart.totalAmount = await productPriceCalculate(cart);
      await db.save(cart);

      res.status(200).send({ cart, request });
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
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
          query: req.query,
        },
        ...(req.query.status && { status: req.query.status }),
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
      if (!request) return res.status(404).send("Requst Item Not Found");

      // find the requested product
      let product = await db.findOne({
        table: Product,
        key: { id: request.product._id },
      });

      // check if new files are uploaded then upload new images and update update database
      if (req?.files && Object.keys(req?.files).length > 0) {
        const newImage = await fileUpload(req.files?.images, imageUp);
        product.images.push(newImage);
      }

      if (req.body.link) {
        product.link = req.body.link;
        delete req.body.link;
      }
      product.price =
        parseInt(req.body.seller_takes) +
        parseInt(req.body.sales_taxs) +
        parseInt(req.body.packers_fee);

      db.save(product);

      db.update({
        table: Request,
        key: {
          id: req.params.id,
          body: req.body,
        },
      })
        .then(async (request) => {
          let cart = await db.findOne({
            table: Cart,
            key: { user: request.user },
          });

          // if previously dont have any proudct in uesr cart then create new cart otherwise just push request id in user cart.
          if (!cart) {
            cart = await db.create({
              table: Cart,
              key: { user: request.user, request: request._id },
            });

            // calculate product total amount and update cart
            cart.totalAmount = await productPriceCalculate(cart);
            await db.save(cart);

            return res.status(200).send({
              message:
                "Request Item Successfully Updated and created new cart item",
              cart,
            });
          } else {
            let exist = false;
            // check cart item exists or not in user cart collection. if item push multiple times they generate wrong callculations.
            await cart.request.map((item) => {
              if (item.requestId === request.requestId) {
                exist = true;
              }
            });

            // if item already exist then only update cart total price and return response.
            if (exist) {
              cart.totalAmount = await productPriceCalculate(cart);
              await db.save(cart);

              return res.status(200).send({
                message:
                  "Request Item Successfully Updated and this item already exists is user cart",
                cart,
              });
            }

            // push new item to user cart and update collection.
            cart.request.push(request._id);
            await db.save(cart);

            cart.totalAmount = await productPriceCalculate(cart);
            await db.save(cart);

            res.status(200).send({
              message: "Request Item Successfully Updated",
              cart,
            });
          }
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
      const request = await Request.findOne({ _id: req.params.id }).populate(
        "user",
        "email"
      );

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
      res.status(200).send({ sendMail, request });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Something went wrong" });
    }
  };
