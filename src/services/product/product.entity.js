import Product from "../product/product.schema";
import settings from "../../../settings.json";
import decodeAuthToken from "../../utils/decodeAuthToken";
import fileDelete from "../../utils/fileDelete";
import fileUpload from "../../utils/fileUpload";
/**
 * these set are use to validate the product information
 */
const createAllowed = new Set([
  "name",
  "description",
  "category",
  "sub_category",
  "tags",
  "images",
  "price",
  "comparePrice",
  "productLink",
  "productFrom",
  "aprox_delivery",
  "moneyback_gurante",
  "stock",
  "status",
  "seller_takes",
  "sales_taxs",
  "packers_fee",
  "shipping_fee",
  "grandTotal",
]);
const updateAllowed = new Set([
  "name",
  "description",
  "category",
  "sub_category",
  "tags",
  "images",
  "price",
  "comparePrice",
  "productLink",
  "productFrom",
  "aprox_delivery",
  "moneyback_gurante",
  "stock",
  "status",
  "seller_takes",
  "sales_taxs",
  "packers_fee",
  "shipping_fee",
  "grandTotal",
]);
const allowedQuery = new Set([
  "name",
  "description",
  "category",
  "sub_category",
  "tags",
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
 * create new product
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the new cretated product object
 */
export const create =
  ({ db, imageUp }) =>
  async (req, res) => {
    try {
      // validate only alowed properties are inserted
      const valid = Object.keys(req.body).every((k) => createAllowed.has(k));
      if (!valid) return res.status(400).send("Bad request");

      // upload all products images
      if (req?.files)
        req.body.images = await fileUpload(req.files.images, imageUp);

      // insert data in product table
      db.create({
        table: Product,
        key: req.body,
      })
        .then(async (product) => {
          await db.save(product);
          res.status(200).send(product);
        })
        .catch(({ message }) => res.status(400).send({ message }));
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  };

/**
 * get all products
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the product list object
 */
export const getProduct =
  ({ db }) =>
  (req, res) => {
    try {
      db.find({
        table: Product,
        key: { allowedQuery, paginate: req.query.paginate === "true" },
      })
        .then(async (products) => {
          // const token =
          //   req.cookies[settings.token_key] ||
          //   req.header("Authorization")?.replace("Bearer ", "");

          // if (!token) {
          //   console.log("in");
          //   if (req.query.paginate !== "true") {
          //     console.log("product", products);
          //     products.map((item) => (item.productLink = undefined));
          //   }
          //   products.docs.map((item) => (item.productLink = undefined));
          //   return res.status(200).send(products);
          // }

          // if (
          //   (await decodeAuthToken(token)?.role) !== "admin" ||
          //   "super-admin"
          // ) {
          //   if (req.query.paginate !== "true") {
          //     products.map((item) => (item.productLink = undefined));
          //   }
          //   products.docs.map((item) => (item.productLink = undefined));
          //   return res.status(200).send(products);
          // }

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
 * get single products
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the single product object
 */
export const getSingleProduct =
  ({ db }) =>
  (req, res) => {
    try {
      db.findOne({
        table: Product,
        key: { id: req.params.id },
      })
        .then(async (products) => {
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
 * update products
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the product list object
 */
export const updateProduct =
  ({ db, imageUp }) =>
  async (req, res) => {
    try {
      // validate only updateAllowed properties
      const valid = Object.keys(req.body).every((k) => updateAllowed.has(k));
      if (!valid) return res.status(400).send("Bad request, Validation failed");

      // find proudct
      const product = await db.findOne({
        table: Product,
        key: { id: req.params.id },
      });

      // check product is exist
      if (!product) return res.status(404).send("Invalid Product ID");

      // check if new files are uploaded then first delete previously uploaded product images and then upload new images
      if (Object.keys(req.files).length > 0) {
        await fileDelete(product.images);
        req.body.images = await fileUpload(req.files?.images, imageUp);
      }

      db.update({
        table: Product,
        key: { id: req.params.id, body: req.body },
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
 * delete products
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the product list object
 */
export const deleteProduct =
  ({ db }) =>
  async (req, res) => {
    try {
      const product = await db.remove({
        table: Product,
        key: { id: req.params.id },
      });
      if (!product)
        return res.status(404).send({ messae: "Product not found" });
      await fileDelete(product.images);
      res.status(200).send({ message: "Deleted Successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Something went wrong" });
    }
  };

/**
 * get related products
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the related product list object
 */
export const relatedProduct =
  ({ db }) =>
  (req, res) => {
    try {
      db.find({
        table: Product,
        key: {
          allowedQuery,
          paginate: true,
          query: { ...req.query },
        },
      })
        .then(async (products) => {
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
