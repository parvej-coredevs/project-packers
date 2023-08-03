import { auth, checkRole } from "../../services/middlewares.js";
import {
  getAllOrder,
  getSingleOrder,
  updateOrder,
  initiateRefund,
  refundStatus,
} from "./order.entity.js";

export default function order() {
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
  this.route.get(
    "/order/:id",
    auth,
    checkRole(["admin"]),
    getSingleOrder(this)
  );

  /**
   * PATCH /order/:id
   * @description This route is used for update order Item. only admin can update order.
   * @response {Object} 200 - updated order object
   */
  this.route.patch("/order/:id", auth, checkRole(["admin"]), updateOrder(this));

  /**
   * GET /initiate-refund/:orderId
   * @description This route is used to initiate refund for a order.
   * @response {Object} 200 - success response
   */
  this.route.get(
    "/initiate-refund/:orderId",
    auth,
    checkRole(["admin"]),
    initiateRefund(this)
  );

  /**
   * GET /refund-status/:orderId
   * @description This route is used for check refund request status.
   * @response {Object} 200 - success response
   */
  this.route.get(
    "/refund-status/:orderId",
    auth,
    checkRole(["admin"]),
    refundStatus(this)
  );
}
