import { auth, checkRole } from "../middlewares";
import { create, createAccess, getStafff } from "./staff.entity";

export default function staff() {
  /**
   * POST /add-staff
   * @description This route is used to create a new new staff.
   * @response {Object} 201 - create new product request
   */
  this.route.post("/add-staff", auth, checkRole(["admin"]), create(this));

  /**
   * POST /get-staff
   * @description This route is used to get staff for admin pae.
   * @response {Object} 200 - return all staff information
   */
  this.route.get("/get-staff", auth, getStafff(this));
  // this.route.get("/get-staff", auth, checkRole(["admin"]), getStafff(this));

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
