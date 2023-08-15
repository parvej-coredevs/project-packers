import Category from "./category.schema";
import SubCategory from "./subcategory.schema";
import Product from "../product/product.schema";
import { Types } from "mongoose";
import checkAssociation from "../../utils/checkAssociation";
/**
 * these set are use to validate the category name
 */
const createAllowed = new Set(["name", "slug"]);
const allowedQuery = new Set([
  "name",
  "slug",
  "search",
  "page",
  "limit",
  "id",
  "paginate",
]);

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
 * get single categories
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of category
 * @returns { Object } returns the single category
 */
export const singleCategory =
  ({ db }) =>
  (req, res) => {
    try {
      db.findOne({
        table: Category,
        key: { slug: req.params.slug },
      })
        .then((category) => {
          res.status(200).json(category);
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
 * This function is used update a category by admin.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the updated category data.
 */
export const updateCategory =
  ({ db }) =>
  async (req, res) => {
    try {
      const category = await db.findOne({
        table: Category,
        key: { slug: req.params.slug },
      });
      if (!category)
        return res.status(400).send("Bad request, Invalid Category");
      category.name = req.body.name;
      await db.save(category);
      res.status(200).send(category);
    } catch (err) {
      console.log(err);
      res.status(err.status || 500).send(err.reason || "Something went wrong");
    }
  };

/**
 * This function is used delete a category by admin.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the updated category data.
 */
export const deleteCategory =
  ({ db }) =>
  async (req, res) => {
    try {
      // let check = await checkAssociation(db, Product, {
      //   category: req.params.id,
      // });

      // if (check)
      //   return res
      //     .status(400)
      //     .send("Can't delete product, This category associated with Product");

      let category = await db.remove({
        table: Category,
        key: { slug: req.params.slug },
      });
      console.log(category);
      if (!category)
        return res.status(404).send({ messae: "Category not found" });
      res.status(200).send({ message: "Deleted Successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Something went wrong" });
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
 * get single categories
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of category
 * @returns { Object } returns the single category
 */
export const singleSubCategory =
  ({ db }) =>
  (req, res) => {
    try {
      db.findOne({
        table: SubCategory,
        key: { slug: req.params.slug },
      })
        .then((category) => {
          res.status(200).json(category);
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
 * @returns { Object } returns the category list
 */
export const getSubCategory =
  ({ db }) =>
  (req, res) => {
    try {
      // if (req.query.category &&  Types.ObjectId(req.query.category))
      db.find({
        table: SubCategory,
        key: {
          paginate: req.query.paginate === "true",
          populate: { path: "parentCat", select: "name slug" },
          ...(req.query.category && { parentCat: req.query.category }),
        },
      })
        .then((categories) => {
          res.status(200).send(categories);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Something went wrong");
        });
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong ");
    }
  };

/**
 * This function is used update a sub category by admin.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the updated sub category data.
 */
export const updateSubCategory =
  ({ db }) =>
  async (req, res) => {
    try {
      const result = await db.update({
        table: SubCategory,
        key: {
          slug: req.params.slug,
          body: req.body,
        },
      });
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res.status(err.status || 500).send(err.reason || "Something went wrong");
    }
  };

/**
 * This function is used update a category by admin.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the updated category data.
 */
export const deleteSubCategory =
  ({ db }) =>
  async (req, res) => {
    try {
      // let check = await checkAssociation(Product, {
      //   sub_category: req.params.id,
      // });

      // if (check)
      //   return res.status(400).send({
      //     message:
      //       "Can't delete product, This sub category associated with Product",
      //   });

      let category = await db.remove({
        table: SubCategory,
        key: { id: req.params.id },
      });
      if (!category)
        return res.status(404).send({ message: "Sub Category not found" });
      res.status(200).send({ message: "Deleted Successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Something went wrong" });
    }
  };
