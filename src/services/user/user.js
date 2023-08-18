import { auth, checkRole } from "../middlewares";
import {
  getAll,
  login,
  logout,
  me,
  register,
  remove,
  updateOwn,
  updateUser,
  userProfile,
  resetPassword,
  verifyOtp,
  updatePassword,
} from "./user.entity";
import passport from "passport";
import { socialUsreRespose } from "./user.middleware";

export default function user() {
  // google authentication
  this.route.get("/auth/google", passport.authenticate("google"));
  this.route.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      session: false,
    }),
    socialUsreRespose
  );

  // facebook authentication
  this.route.get("/auth/facebook", passport.authenticate("facebook"));
  this.route.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      session: true,
    }),
    socialUsreRespose
  );

  /**
   * POST /user
   * @description This route is used to create a user.
   * @response {Object} 200 - the new user.
   */
  this.route.post("/user", register(this));

  /**
   * POST /user/login
   * @description this route is used to login a user.
   * @response {Object} 200 - the user.
   */
  this.route.post("/user/login", login(this));

  /**
   * POST /logout
   * @description this route is user logout.
   * @response {Object} 200 - the user.
   */
  this.route.get("/user/logout", auth, logout(this));

  /**
   * GET /user/me
   * @description this route is used to get user profile.
   * @response {Object} 200 - the user.
   */
  this.route.get("/user/me", auth, me(this));

  /**
   * POST /user/logout
   * @description this route is used to logout a user.
   * @response {Object} 200 - the user.
   */
  this.route.post("/user/logout", auth, logout(this));

  /**
   * GET /user
   * @description this route is used to used get all user.
   * @response {Object} 200 - the users.
   */
  this.route.get("/user", auth, getAll(this));

  /**
   * GET user/profile/:id
   * @description this route is used to get a user profile by id.
   * @response {Object} 200 - the user.
   */
  this.route.get("/user/profile/:id", auth, userProfile(this));

  /**
   * PATCH ‘/user/me’
   * @description this route is used to update own profile.
   * @response {Object} 200 - the user.
   */
  this.route.patch("/user/me", auth, updateOwn(this));

  /**
   * PATCH ‘/user/:id’
   * @description this route is used to update user profile only admin can allowed.
   * @response {Object} 200 - the user.
   */
  this.route.patch("/user/:id", auth, checkRole(["admin"]), updateUser(this));

  /**
   * DELETE ‘/user/:id’
   * @description this route is used to delte user profile.
   * @response {Object} 200 - the user.
   */
  this.route.delete(
    "/user/:id",
    auth,
    checkRole(["admin", "super-admin"]),
    remove(this)
  );

  /**
   * POST /user/reset-password
   * @description this route is used for reset user password.
   * @response {Object} 200 - encrypted token.
   */
  this.route.post("/user/reset-password", resetPassword(this));

  /**
   * POST /user/verify-otp
   * @description this route is used for verify otp.
   * @response {Object} 200 - encrypted token.
   */
  this.route.post("/user/verify-otp", verifyOtp(this));

  /**
   * POST /user/verify-otp
   * @description this route is used for verify otp.
   * @response {Object} 200 - encrypted token.
   */
  this.route.post("/user/new-password", updatePassword(this));
}
