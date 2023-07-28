import { auth, checkRole } from "../../services/middlewares.js";
import { getAllOrder } from "./order.entity.js";

export default function order() {
  /**
   * POST /order
   * @description This route is used to create a new new orde.
   * @response {Object} 201 - create new coupon
   */
  // this.route.post("/order", auth, createOrder(this));

  /**
   * GET /order
   * @description This route is used to get all order items.
   * @response {Object} 200 - order list
   */
  this.route.get("/order", auth, checkRole(["admin"]), getAllOrder(this));

  /**
   * GET /order/:id
   * @description This route is used to get single order.
   * @response {Object} 200 - single order item
   */
  // this.route.get(
  //   "/order/:id",
  //   auth,
  //   checkRole(["admin"]),
  //   getSingleOrder(this)
  // );

  /**
   * PATCH /order/:id
   * @description This route is used for update order Item. only admin can update order.
   * @response {Object} 200 - updated order object
   */
  // this.route.patch("/order/:id", auth, checkRole(["admin"]), updateOrder(this));

  /**
   * DELETE /order/:id
   * @description This route is used for delete order. only admin can delete order
   * @response {Object} 200 - return deleted message
   */
  // this.route.delete(
  //   "/order/:id",
  //   auth,
  //   checkRole(["admin"]),
  //   deleteOrder(this)
  // );
}
