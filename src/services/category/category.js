import { checkRole, auth } from "../middlewares";
import {
  create,
  getCategory,
  singleCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  singleSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "./category.entity";

export default function category() {
  /**
   * POST /category
   * @description This route is used for create category. only admin can create category.
   * @returns {Object} 200 - new category.
   */
  this.route.post("/category", auth, checkRole(["admin"]), create(this));

  /**
   * GET /category/:slug
   * @description This route is used get single category.
   * @returns {Object} 200 - single category.
   */
  this.route.get("/category/:slug", singleCategory(this));

  /**
   * GET /category
   * @description This route is used for get all category.
   * @returns {Object} 200 - all category list.
   */
  this.route.get("/category", getCategory(this));

  /**
   * PATCH /category/:slug
   * @description This route is used for update category.
   * @returns {Object} 200 - get update category.
   */
  this.route.patch(
    "/category/:slug",
    auth,
    checkRole(["admin"]),
    updateCategory(this)
  );

  /**
   * DELETE /category/:id
   * @description This route is used for delete category.
   * @returns {Object} 200 - success message
   */
  this.route.delete(
    "/category/:slug",
    auth,
    checkRole(["admin"]),
    deleteCategory(this)
  );

  // Statr Sub Category

  /**
   * POST /sub-category
   * @description This route is used for create sub category. only admin can create sub category.
   * @returns {Object} 200 - new category.
   */
  this.route.post(
    "/sub-category",
    auth,
    checkRole(["admin"]),
    createSubCategory(this)
  );
  /**
   * GET /sub-category/:slug
   * @description This route is used get single sub category.
   * @returns {Object} 200 - single slug category.
   */
  this.route.get("/sub-category/:slug", singleSubCategory(this));

  /**
   * GET /sub-category
   * @description This route is used for get all category with pagination.
   * @returns {Object} 200 - all category list.
   */
  this.route.get("/sub-category", getSubCategory(this));

  /**
   * PATCH /sub-category/:slug
   * @description This route is used for update sub-category.
   * @returns {Object} 200 - get update sub-category.
   */
  this.route.patch(
    "/sub-category/:slug",
    auth,
    checkRole(["admin"]),
    updateSubCategory(this)
  );

  /**
   * DELETE /sub-category/:id
   * @description This route is used for delete sub-category.
   * @returns {Object} 200 - get delete sub-category.
   */
  this.route.delete(
    "/sub-category/:id",
    auth,
    checkRole(["admin"]),
    deleteSubCategory(this)
  );
}
