import Request from "../request/request.schema";
import fileDelete from "../../utils/fileDelete";
import fileUpload from "../../utils/fileUpload";
import randomId from "../../utils/randomId";
import Order from "../order/order.schema";
/**
 * these set are use to validate the request item information
 */
const createAllowed = new Set([
  "productName",
  "productLink",
  "quantity",
  "note",
  "images",
]);
const updateAllowed = new Set([
  "productLink",
  "productName",
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
  "productName",
  "_id",
  "price",
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
      const valid = Object.keys(req.body).every((k) => createAllowed.has(k));
      if (!valid) return res.status(400).send("Bad request, Validation failed");

      // upload all products images
      if (Object.keys(req.files).length > 0) {
        req.body.images = await fileUpload(req.files.images, imageUp);
      }
      // insert data in request table
      db.create({
        table: Request,
        key: { requestId: randomId(), user: req.user._id, ...req.body },
      })
        .then(async (request) => {
          await db.save(request);
          res.status(200).send(request);
        })
        .catch(({ message }) => res.status(400).send({ message }));
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
          populate: { path: "user", select: "full_name email phone" },
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
          populate: { path: "user" },
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
        await fileDelete(product.images);
        req.body.images = await fileUpload(req.files?.images, imageUp);
      }

      db.update({
        table: Request,
        key: { id: req.params.id, body: req.body },
      })
        .then((products) => {
          // email a invoice send korte hobe
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
      const request = await db.remove({
        table: Request,
        key: { id: req.params.id },
      });
      if (!request)
        return res.status(404).send({ messae: "Request Item does not exist" });
      await fileDelete(request.images);
      res.status(200).send({ message: "Deleted Successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Something went wrong" });
    }
  };
