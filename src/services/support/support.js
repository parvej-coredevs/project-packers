import { create, getSupportList } from "./support.entity";
import { auth } from "../middlewares";
export default function support() {
  /**
   * POST /support
   * @description This route is used to create a support.
   * @response {Object} 200 - the new user.
   */
  this.route.post("/support", auth, create(this));

  /**
   * GET /request
   * @description This route is used to find request item.
   * @response {Object} 200 - request list
   */
  this.route.get("/support", auth, getSupportList(this));

  // /**
  //  * GET /request/:id
  //  * @description This route is used to find single request item.
  //  * @response {Object} 200 - single request item object
  //  */
  // this.route.get("/request/:id", auth, getSingleRequest(this));

  // /**
  //  * PATCH /request/:id
  //  * @description This route is used for update request Item. only admin can update request. when item updated user receives invoice for this item.
  //  * @response {Object} 200 - updated request object
  //  */
  // this.route.patch(
  //   "/request/:id",
  //   auth,
  //   checkRole(["admin"]),
  //   updateRequest(this)
  // );

  // /**
  //  * DELETE /request/:id
  //  * @description This route is used for delete request. only admin can delete request
  //  * @response {Object} 200 - updated request object
  //  */
  // this.route.delete(
  //   "/request/:id",
  //   auth,
  //   checkRole(["admin"]),
  //   deleteRequest(this)
  // );
}
