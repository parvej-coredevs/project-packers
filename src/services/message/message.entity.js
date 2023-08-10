import Support from "../support/support.schema";
import fileDelete from "../../utils/fileDelete";
import fileUpload from "../../utils/fileUpload";
import randomId from "../../utils/randomId";
import Message from "./message.schema";
/**
 * these set are use to validate the request item information
 */
const createAllowed = new Set(["user", "support", "sender", "message"]);
const allowedQuery = new Set([
  "type",
  "orderId",
  "comment",
  "is_open",
  "_id",
  "price",
  "status",
  "search",
  "page",
  "limit",
  "id",
  "paginate",
]);

/**
 * create new message
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the new message
 */
export const create =
  ({ db, ws }) =>
  async (req, res) => {
    try {
      // validate only alowed properties are inserted
      const valid = Object.keys(req.body).every((k) => createAllowed.has(k));
      if (!valid) return res.status(400).send("Bad request, Validation failed");

      // insert data in message collection
      const message = await db.create({
        table: Message,
        key: { ...req.body, user: req.user.id },
      });

      ws.to("roomname").emit("supportcreated", message);

      res.send(message);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  };

/**
 * get all messageby support
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the message list
 */
export const allmessage =
  ({ db }) =>
  (req, res) => {
    try {
      const paginate = req.query.paginate === "true" ? true : false;
      delete req.query.paginate;
      db.find({
        table: Message,
        key: {
          allowedQuery,
          paginate,
          populate: {
            path: "user support",
          },
          query: req.query,
          support: req.params.supportId,
        },
      })
        .then((message) => {
          res.status(200).send(message);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error: " + err.message);
        });
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };

/**
 * create support
 * @param { Object } db the db object for interacting with the database
 * @param { Object } data data is payload of when socket emit and pass data
 */
export const supportCreate = async ({ data, db }) => {
  try {
    const support = await db.create({ table: Support, key: data });
    console.log("support", support);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};

/**
 * support agent user joined support-agent room
 * @param { Object } db the db object for interacting with the database
 * @param { Object } data data is payload of when socket emit and pass data
 */
export const joinSupportAgentRoom = async ({ data, ws }) => {
  try {
    // console.log("ws", ws);
    ws.emit("joinagent", data);

    // console.log("room", data);
    console.log("rooms", ws.rooms);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};

export const joinedSupportAgent = async ({ data, ws }) => {
  try {
    console.log("data", data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};
