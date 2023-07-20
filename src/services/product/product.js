import { auth, checkRole } from "../../services/middlewares.js";
import {
  create,
  getProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  relatedProduct,
} from "../product/product.entity.js";

export default function product() {
  /**
   * POST /products
   * @description This route is used to create a product.
   * @response {Object} 201 - create new product
   */
  this.route.post("/products", auth, checkRole(["admin"]), create(this));

  /**
   * GET /products
   * @description This route is used to find product with and without pagination.
   * @response {Object} 200 - product list
   */
  this.route.get("/products", getProduct(this));

  /**
   * GET /products/:id
   * @description This route is used to find single product.
   * @response {Object} 200 - single product object
   */
  this.route.get("/products/:id", getSingleProduct(this));

  /**
   * PATCH /products/:id
   * @description This route is used for update product. only admin can update products
   * @response {Object} 200 - updated product object
   */
  this.route.patch(
    "/products/:id",
    auth,
    checkRole(["admin"]),
    updateProduct(this)
  );

  /**
   * DELETE /products/:id
   * @description This route is used for delete product. only admin can delete products
   * @response {Object} 200 - updated product object
   */
  this.route.delete(
    "/products/:id",
    auth,
    checkRole(["admin"]),
    deleteProduct(this)
  );

  /**
   * GET /products/:id/related
   * @description This route is used for related product. when customer open single product user also can see some related product.
   * @response {Object} 200 - related product object
   */
  this.route.get("/products/:id/related", relatedProduct(this));
}
