import { auth, checkRole } from "../../services/middlewares.js";
import {
  create,
  getProduct,
  updateProduct,
} from "../product/product.entity.js";

export default function product() {
  /**
   * POST /products
   * @description This route is used to create a product.
   * @response {Object} 201 - new created product
   */
  this.route.post("/products", auth, checkRole(["admin"]), create(this));

  /**
   * GET /products
   * @description This route is used to find product with and without pagination.
   * @response {Object} 200 - product list
   */
  this.route.get("/products", getProduct(this));

  /**
   * PATCH /products
   * @description This route is used for update product.
   * @response {Object} 200 - updated product object
   */
  this.route.patch("/products", updateProduct(this));
}
