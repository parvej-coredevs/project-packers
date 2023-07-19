import { checkRole, auth } from "../middlewares";
import {
  create,
  getCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
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
   * GET /category
   * @description This route is used for get all category.
   * @returns {Object} 200 - all category list.
   */
  this.route.get("/category", getCategory(this));

  /**
   * PATCH /category/:id/edit
   * @description This route is used for update category.
   * @returns {Object} 200 - get update category.
   */
  this.route.patch(
    "/category/:id/edit",
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
    "/category/:id",
    auth,
    checkRole(["admin"]),
    deleteCategory(this)
  );

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
   * GET /sub-category
   * @description This route is used for get all category with pagination.
   * @returns {Object} 200 - all category list.
   */
  this.route.get("/sub-category", getSubCategory(this));

  /**
   * PATCH /sub-category/:id/edit
   * @description This route is used for update sub-category.
   * @returns {Object} 200 - get update sub-category.
   */
  this.route.patch(
    "/sub-category/:id/edit",
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
