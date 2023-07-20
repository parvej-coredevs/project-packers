import { auth, checkRole } from "../../services/middlewares.js";
import {
  create,
  getRequestItem,
  getSingleRequest,
  updateRequest,
  deleteRequest,
} from "./request.entity.js";

export default function request() {
  /**
   * POST /request
   * @description This route is used to create a product request.
   * @response {Object} 201 - create new item request
   */
  this.route.post("/request", auth, create(this));

  /**
   * GET /request
   * @description This route is used to find request item.
   * @response {Object} 200 - request list
   */
  this.route.get("/request", auth, getRequestItem(this));

  /**
   * GET /request/:id
   * @description This route is used to find single request item.
   * @response {Object} 200 - single request item object
   */
  this.route.get("/request/:id", auth, getSingleRequest(this));

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
}
