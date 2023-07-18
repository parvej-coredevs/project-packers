import { checkRole, auth } from "../middlewares";
import {
  create,
  getCategory,
  createSubCategory,
  getSubCategory,
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
   * @description This route is used for get all category with pagination.
   * @returns {Object} 200 - all category list.
   */
  this.route.get("/category", getCategory(this));

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
}
e;
