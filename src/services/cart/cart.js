import { checkRole, auth } from "../middlewares";
import {
  getUserCart,
  couponApply,
  cartQuantityUpdate,
  // singleCategory,
  // updateCategory,
  // deleteCategory,
} from "./cart.entity";

export default function cart() {
  /**
   * GET /user-cart
   * @description This route is used get user cart.
   * @returns {Object} 200 - user cart item list.
   */
  this.route.get("/user-cart", auth, getUserCart(this));

  /**
   * POST /coupn
   * @description This route is used to create a new coupon.
   * @response {Object} 201 - create new coupon
   */
  this.route.post("/coupon/apply", auth, couponApply(this));

  /**
   * POST /cart/quantity-update
   * @description This route is used to update user cart item quantity.
   * @response {Object} 200 - update cart item
   */
  this.route.post("/cart/quantity-update", auth, cartQuantityUpdate(this));

  // /**
  //  * GET /category
  //  * @description This route is used for get all category.
  //  * @returns {Object} 200 - all category list.
  //  */
  // this.route.get("/category", getCategory(this));

  // /**
  //  * PATCH /category/:slug
  //  * @description This route is used for update category.
  //  * @returns {Object} 200 - get update category.
  //  */
  // this.route.patch(
  //   "/category/:slug",
  //   auth,
  //   checkRole(["admin"]),
  //   updateCategory(this)
  // );

  // /**
  //  * DELETE /category/:id
  //  * @description This route is used for delete category.
  //  * @returns {Object} 200 - success message
  //  */
  // this.route.delete(
  //   "/category/:slug",
  //   auth,
  //   checkRole(["admin"]),
  //   deleteCategory(this)
  // );
}
