import {
  create,
  getSupportList,
  supportCreate,
  joinSupportAgentRoom,
  joinedSupportAgent,
} from "./support.entity";
import { auth } from "../middlewares";

export default function support() {
  /**
   * POST /support
   * @description This route is used to create a support.
   * @response {Object} 200 - the new user.
   */
  this.route.post("/support", auth, create(this));

  /**
   * GET /support
   * @description This route is used to find request item.
   * @response {Object} 200 - request list
   */
  this.route.get("/support", auth, getSupportList(this));
}

export function supportSocket(app) {
  app.register("joinsupporagent", joinSupportAgentRoom);
  app.register("joinedagent", joinedSupportAgent);
  app.register("createsupport", supportCreate);
}
