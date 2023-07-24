import Request from "../request/request.schema";
import Product from '../product/product.schema'
import fileDelete from "../../utils/fileDelete";
import fileUpload from "../../utils/fileUpload";
import randomId from "../../utils/randomId";
import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId
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
      const validProduct = Object.keys(req.body.product).every((k) => new Set(['name', 'link', 'images']).has(k));
      if (!validProduct) return res.status(400).send("Bad request, Validation failed");

      const validRequest = Object.keys(req.body.request).every((k) => new Set(['quantity', 'note']).has(k));
      if (!validRequest) return res.status(400).send("Bad request, Validation failed");

      // upload all products images
      if (req?.files && Object.keys(req?.files).length > 0) {
        req.body.product.images = await fileUpload(req.files.images, imageUp);
      }

      // insert data in product table
      const product = await db.create({
        table: Product,
        key: req.body.product,
      })

      // insert data in request table
      const request = await db.create({
        table: Request,
        key: { requestId: randomId(), user: req.user._id, product: product._id, ...req.body.request },
      })

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
  ({ db, imageUp }) =>
  async (req, res) => {
    try {
      // check product id is valid
      if (!ObjectId.isValid(req.body.product)) return res.status(400).send("Invalid Product Id")

      // validate only alowed properties are inserted
      const valid = Object.keys(req.body).every((k) => new Set(['quantity', 'note', 'product']).has(k));
      if (!valid) return res.status(400).send("Bad request, Validation failed");

      // insert data in request table
      const request = await db.create({
        table: Request,
        key: { requestId: randomId(), user: req.user._id, ...req.body },
      })

      res.status(200).send(request);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
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
          body: { images: newImage }
        })
      }

      db.update({
        table: Request,
        key: { id: req.params.id, body: req.body, populate: { path: "user product" } },
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
      }).then(request => {
        res.status(200).send({ message: "Deleted Successfully", request });
      }).catch(err => {
        console.log(err);
        res.status(400).send({ message: err.message })
      })
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Something went wrong" });
    }
  };
