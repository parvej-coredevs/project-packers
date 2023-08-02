import { checkRole, auth } from "../middlewares";
import {
  getUserCart,
  couponApply,
  cartQuantityUpdate,
  initiatePaymentCheckout,
  checkoutSuccess,
  checkoutFail,
  checkoutCancel,
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

  /**
   * POST /initiate-payment
   * @description This route is used for initiate-payment.
   * @response {Object} 201 - create a existing product request
   */
  this.route.post("/initiate-payment", auth, initiatePaymentCheckout(this));

  /**
   * POST /checkout-success
   * @description This route call from sll commerze server when user payment is success.
   */
  this.route.post("/checkout-success", checkoutSuccess(this));

  /**
   * POST /checkout-fail
   * @description This route call from sll commerze server when user payment is fail.
   */
  this.route.post("/checkout-fail", checkoutFail(this));

  /**
   * POST /checkout-cancel
   * @description This route call from sll commerze server when user payment is cancel.
   */
  this.route.post("/checkout-cancel", checkoutCancel(this));
}
