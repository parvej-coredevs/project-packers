import Blog from "./blog.schema";
import fileDelete from "../../utils/fileDelete";
import fileUpload from "../../utils/fileUpload";
/**
 * these set are use to validate the blog information
 */
const createAllowed = new Set([
  "title",
  "slug",
  "description",
  "category",
  "status",
]);
const updateAllowed = new Set([
  "name",
  "slug",
  "link",
  "from",
  "description",
  "sub_category",
  "tags",
  "price",
  "comparePrice",
  "stock",
  "status",
  "images",
  "moneyback_gurante",
]);
const allowedQuery = new Set([
  "name",
  "slug",
  "link",
  "from",
  "description",
  "tags",
  "sub_category",
  "price",
  "status",
  "_id",
  "sortBy",
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
  ({ db }) =>
  async (req, res) => {
    try {
      // validate only alowed properties are inserted
      const valid = Object.keys(req.body).every((k) => createAllowed.has(k));
      if (!valid) return res.status(400).send("Bad request, validation failed");

      // upload all products images
      if (Object.keys(req?.files).length > 0)
        req.body.images = await fileUpload(req.files.images, imageUp);

      // insert data in product table
      const product = await db.create({
        table: Product,
        key: req.body,
      });

      res.status(200).send(product);
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
      const query = {};
      if (req.query?.search) query.search = req.query.search;
      if (req.query?.sortBy) query.sortBy = req.query.sortBy;
      if (req.query?.page) query.page = req.query.page;
      if (req.query?.limit) query.limit = req.query.limit;

      db.find({
        table: Product,
        key: {
          allowedQuery,
          paginate: req.query.paginate === "true",
          query,
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
        key: {
          slug: req.params.slug,
          // populate: { path: "category sub_category", select: "name" },
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
        key: { slug: req.params.slug },
      });

      // check product is exist
      if (!product) return res.status(404).send("Product Does not exist");

      // check if new files are uploaded then first delete previously uploaded product images and then upload new images
      if (Object.keys(req.files).length > 0) {
        await fileDelete(product.images);
        req.body.images = await fileUpload(req.files?.images, imageUp);
      }

      db.update({
        table: Product,
        key: {
          slug: req.params.slug,
          body: req.body,
        },
      })
        .then((product) => {
          res.status(200).send(product);
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
  async (req, res) => {
    try {
      const product = await db.findOne({
        table: Product,
        key: {
          id: req.params.id,
        },
      });

      if (Object.keys(product).length < 1)
        return res.status(404).send("Product not found");

      const relatedProduct = await Product.find({
        status: "published",
        sub_category: { $in: product.sub_category },
      }).limit(4);

      res.send(relatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };
