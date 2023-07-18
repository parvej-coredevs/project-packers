import Category from "./category.schema";
import SubCategory from "./subcategory.schema";

/**
 * these set are use to validate the category name
 */
const createAllowed = new Set(["name"]);
const updateAllowed = new Set(["name"]);
const allowedQuery = new Set(["name"]);

/**
 * create a new category
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of category
 * @returns { Object } returns the new category including name
 */
export const create =
  ({ db }) =>
  async (req, res) => {
    try {
      const category = Object.keys(req.body).every((key) =>
        createAllowed.has(key)
      );
      if (!category) return res.status(400).send("Validation Failed");
      db.create({ table: Category, key: req.body })
        .then(async (category) => {
          await db.save(category);
          res.status(201).send(category);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Something went wrong");
        });
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };

/**
 * get all categories
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of category
 * @returns { Object } returns the new category including name
 */
export const getCategory =
  ({ db }) =>
  (req, res) => {
    try {
      db.find({
        table: Category,
        key: { allowedQuery, paginate: req.query.paginate === "true" },
      })
        .then(async (categories) => {
          res.status(200).send(categories);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Something went wrong");
        });
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };

/**
 * create a new sub category
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of category
 * @returns { Object } returns the new  sub category including name, parent category id
 */
export const createSubCategory =
  ({ db }) =>
  async (req, res) => {
    try {
      db.create({ table: SubCategory, key: req.body })
        .then(async (category) => {
          await db.save(category);
          res.status(201).send(category);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Something went wrong");
        });
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };

/**
 * get all sub categories
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of category
 * @returns { Object } returns the new category including name
 */
export const getSubCategory =
  ({ db }) =>
  (req, res) => {
    try {
      db.find({
        table: SubCategory,
        key: { paginate: req.query.paginate === "true" },
      })
        .then(async (categories) => {
          res.status(200).send(categories);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Something went wrong");
        });
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };
