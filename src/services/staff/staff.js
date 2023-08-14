import { auth, checkRole } from "../middlewares";
import { create } from "./staff.entity";

export default function staff() {
  /**
   * POST /request/new-item
   * @description This route is used to create a new product request.
   * @response {Object} 201 - create new product request
   */
  this.route.post("/add-staff", auth, checkRole(["admin"]), create(this));
}
