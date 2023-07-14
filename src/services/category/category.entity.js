import Category from "./category.schema";

/**
 * these set are use to validate the category title and slug
 */
const createAllowed = new Set(["title", "slug"]);
const updateAllowed = new Set(["title"]);
const allowedQuery = new Set(["slug"]);

/**
 * create a new category
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of category
 * @returns { Object } returns the new category including title and slug
 */
export const create =
  ({ db }) =>
  async (req, res) => {
    try {
      const category = Object.keys(req.body).every((key) =>
        createAllowed.includes(key)
      );
      if (!category) return res.status(400).send("Validation Failed");
      db.create({ table: "category", key: req.body })
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
 * @returns { Object } returns the new category including title and slug
 */
export const getCategory =
  ({ db }) =>
  (req, res) => {
    try {
      db.find({ table: "category" })
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
