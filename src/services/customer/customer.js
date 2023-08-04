import { auth, checkRole } from "../../services/middlewares.js";
import { getCustomer, getCustomerOrder } from "./customer.entity.js";

export default function coupon() {
  /**
   * GET /customers
   * @description This route is used to create a new coupon.
   * @response {Object} 201 - create new coupon
   */
  this.route.get("/customers", auth, checkRole(["admin"]), getCustomer(this));

  /**
   * GET /customer/:userId/order
   * @description This route is used to create a new coupon.
   * @response {Object} 201 - create new coupon
   */
  this.route.get(
    "/customer/:userId/order",
    auth,
    checkRole(["admin"]),
    getCustomerOrder(this)
  );

  /**
   * GET /coupon/:id
   * @description This route is used to find single coupon item.
   * @response {Object} 200 - single coupon item object
   */
  // this.route.get("/coupon/:id", auth, getSinglecoupon(this));
}
