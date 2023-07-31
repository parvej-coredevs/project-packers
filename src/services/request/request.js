import { auth, checkRole } from "../../services/middlewares.js";
import {
  create,
  createExist,
  // requestCheckout,
  initiatePaymentCheckout,
  checkoutSuccess,
  checkoutFail,
  checkoutCancel,
  getRequestItem,
  getSingleRequest,
  updateRequest,
  deleteRequest,
  sendRequestInvoice,
} from "./request.entity.js";

export default function request() {
  /**
   * POST /request/new-item
   * @description This route is used to create a new product request.
   * @response {Object} 201 - create new product request
   */
  this.route.post("/request/new-item", auth, create(this));

  /**
   * POST /request/exist-item
   * @description This route is used to create a existing product request.
   * @response {Object} 201 - create a existing product request
   */
  this.route.post("/request/exist-item", auth, createExist(this));

  /**
   * GET /request/checkout
   * @description This route is used for request cart item. when admin send requested product cost,tax,packing fee then user can see this product
   * in their checkout cart page
   * @response {Object} 200 - get requested cart item.
   */
  // this.route.get("/request/checkout", auth, requestCheckout(this));

  /**
   * POST /initiate-checkout
   * @description This route is used for initiate-checkout.
   * @response {Object} 201 - create a existing product request
   */
  this.route.post("/initiate-checkout", auth, initiatePaymentCheckout(this));

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

  /**
   * GET /request
   * @description This route is used to find all request item for admin dahsboard.
   * @response {Object} 200 - request list
   */
  this.route.get("/request", auth, checkRole(["admin"]), getRequestItem(this));

  /**
   * GET /request/:id
   * @description This route is used to find single request item for admin dashboard.
   * @response {Object} 200 - single request item object
   */
  this.route.get(
    "/request/:id",
    auth,
    checkRole(["admin"]),
    getSingleRequest(this)
  );

  /**
   * PATCH /request/:id
   * @description This route is used for update request Item. only admin can update request. when item updated user receives invoice for this item.
   * @response {Object} 200 - updated request object
   */
  this.route.patch(
    "/request/:id",
    auth,
    checkRole(["admin"]),
    updateRequest(this)
  );

  /**
   * DELETE /request/:id
   * @description This route is used for delete request. only admin can delete request
   * @response {Object} 200 - updated request object
   */
  this.route.delete(
    "/request/:id",
    auth,
    checkRole(["admin"]),
    deleteRequest(this)
  );

  /**
   * GET /request/:id/send-invoice
   * @description This route is used for send product invoice. only admin can send this request
   * @response {Object} 200 - success message
   */
  this.route.get(
    "/request/:id/send-invoice",
    auth,
    checkRole(["admin"]),
    sendRequestInvoice(this)
  );
}
