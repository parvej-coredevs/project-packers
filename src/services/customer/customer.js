import { auth, checkRole } from "../../services/middlewares.js";
import {
  getCustomer,
  getCustomerOrder,
  exportCustomerData,
} from "./customer.entity.js";

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
    "/order/:userId/customer",
    auth,
    checkRole(["admin"]),
    getCustomerOrder(this)
  );

  /**
   * GET /export-customer
   * @description This route is used for export customer data.
   * @response {Object} 200 - return the server download link
   */
  this.route.get(
    "/export-customer",
    auth,
    checkRole(["admin"]),
    exportCustomerData(this)
  );
}
