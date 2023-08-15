import { auth, checkRole } from "../middlewares";
import { create, createAccess } from "./staff.entity";

export default function staff() {
  /**
   * POST /add-staff
   * @description This route is used to create a new new staff.
   * @response {Object} 201 - create new product request
   */
  this.route.post("/add-staff", auth, checkRole(["admin"]), create(this));

  /**
   * POST /create-access
   * @description This route is used to create access.
   * @response {Object} 201 - create new product request
   */
  this.route.post(
    "/create-access",
    auth,
    checkRole(["admin"]),
    createAccess(this)
  );
}
