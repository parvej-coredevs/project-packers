import Product from "../product/product.schema";
import settings from "../../../settings.json";
import decodeAuthToken from "../../utils/decodeAuthToken";
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
  "aprox_delivery",
  "stock",
  "status",
  "seller_takes",
  "sales_taxs",
  "packers_fee",
]);
const updateAllowed = new Set([
  "name",
  "description",
  "category",
  "sub_category",
  "tags",
  "images",
  "price",
  "compare_price",
  "productLink",
  "aprox_delivery",
  "stock",
  "status",
  "seller_takes",
  "sales_taxs",
  "packers_fee",
]);
const allowedQuery = new Set([
  "_id",
  "category",
  "sub_category",
  "price",
  "status",
]);

export const create =
  ({ db, imageUp }) =>
  async (req, res) => {
    try {
      // validate only alowed properties are inserted
      const valid = Object.keys(req.body).every((k) => createAllowed.has(k));
      if (!valid) return res.status(400).send("Bad request");

      // upload all products images
      req.body.images = [];
      if (req.files && req.files.images) {
        for (let item of req.files.images) {
          const product = await imageUp(item?.path);
          req.body.images.push(product);
        }
      }

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
          const token =
            req.cookies[settings.token_key] ||
            req.header("Authorization")?.replace("Bearer ", "");

          if (!token) {
            console.log("in");
            if (req.query.paginate !== "true") {
              console.log("product", products);
              products.map((item) => (item.productLink = undefined));
            }
            products.docs.map((item) => (item.productLink = undefined));
            return res.status(200).send(products);
          }

          if (
            (await decodeAuthToken(token)?.role) !== "admin" ||
            "super-admin"
          ) {
            if (req.query.paginate !== "true") {
              products.map((item) => (item.productLink = undefined));
            }
            products.docs.map((item) => (item.productLink = undefined));
            return res.status(200).send(products);
          }

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
  ({ db }) =>
  (req, res) => {
    try {
      db.find({
        table: Product,
        key: { allowedQuery, paginate: req.query.paginate === "true" },
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
