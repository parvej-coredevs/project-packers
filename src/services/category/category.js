import { checkRole, auth } from "../middlewares";
import { create, getCategory } from "./category.entity";

export default function category() {
  /**
   * POST /category
   * @description This route is used for create category. only admin can create category.
   * @returns {Object} 200 - new category.
   */
  this.route.post(
    "/category",
    checkRole(["admin", "super-admin"]),
    create(this)
  );

  /**
   * GET /category
   * @description This route is used for get all category with paginattion.
   * @returns {Object} 200 - all category list.
   */
  this.route.get("/category", getCategory(this));

  /**
   * GET /category
   * @description This route is used for get all category with paginattion.
   * @returns {Object} 200 - all category list.
   */
  this.route.get("/category", getCategory(this));
}
