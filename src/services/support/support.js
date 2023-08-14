import {
  create,
  getSupportList,
  getSingleSupport,
  updateSupport,
  roomCreate,
  supportCreate,
  joinSupportAgentRoom,
  joinedSupportAgent,
} from "./support.entity";
import { auth } from "../middlewares";

export default function support() {
  /**
   * POST /support
   * @description This route is used to create a new support.
   * @response {Object} 200 - the new suport.
   */
  this.route.post("/support", auth, create(this));

  /**
   * GET /support
   * @description This route is used to get all support list.
   * @response {Object} 200 - support list
   */
  this.route.get("/supportlist", auth, getSupportList(this));

  /**
   * GET /support/:supportId
   * @description This route is used to get single support.
   * @response {Object} 200 - get single support
   */
  this.route.get("/support/:supportId", auth, getSingleSupport(this));

  /**
   * GET /support/:supportId
   * @description This route is used to get single support.
   * @response {Object} 200 - get single support
   */
  this.route.patch("/support/:supportId", auth, updateSupport(this));
}

export function supportSocket(app) {
  app.register("createdRoom", roomCreate);
}
