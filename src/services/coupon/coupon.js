import { auth, checkRole } from "../../services/middlewares.js";
import {
  create,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} from "./coupon.entity.js";

export default function coupon() {
  /**
   * POST /coupn
   * @description This route is used to create a new coupon.
   * @response {Object} 201 - create new coupon
   */
  this.route.post("/coupon", auth, checkRole(["admin"]), create(this));

  /**
   * GET /coupon
   * @description This route is used to get all coupon.
   * @response {Object} 200 - coupon list
   */
  this.route.get("/coupon", auth, checkRole(["admin"]), getCoupon(this));

  /**
   * GET /coupon/:id
   * @description This route is used to find single coupon item.
   * @response {Object} 200 - single coupon item object
   */
  // this.route.get("/coupon/:id", auth, getSinglecoupon(this));

  /**
   * PATCH /coupon/:id
   * @description This route is used for update coupon Item. only admin can update coupon. when item updated user receives invoice for this item.
   * @response {Object} 200 - updated coupon object
   */
  this.route.patch(
    "/coupon/:code",
    auth,
    checkRole(["admin"]),
    updateCoupon(this)
  );

  /**
   * DELETE /coupon/:id
   * @description This route is used for delete coupon. only admin can delete coupon
   * @response {Object} 200 - deleted success message
   */
  this.route.delete(
    "/coupon/:id",
    auth,
    checkRole(["admin"]),
    deleteCoupon(this)
  );
}
