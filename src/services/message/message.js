import {
  create,
  allmessage,
  supportCreate,
  joinSupportAgentRoom,
  joinedSupportAgent,
} from "./message.entity";
import { auth } from "../middlewares";

export default function message() {
  /**
   * POST /createmessage
   * @description This route is used to create a new message.
   * @response {Object} 200 - the new message.
   */
  this.route.post("/createmessage", auth, create(this));

  /**
   * GET /allmessage
   * @description This route is used to get all message.
   * @response {Object} 200 - message list
   */
  this.route.get("/allmessage/:supportId", auth, allmessage(this));
}

export function supportSocket(app) {
  app.register("joinsupporagent", joinSupportAgentRoom);
  app.register("joinedagent", joinedSupportAgent);
  app.register("createsupport", supportCreate);
}
