import Support from "../support/support.schema";
import fileDelete from "../../utils/fileDelete";
import fileUpload from "../../utils/fileUpload";
import randomId from "../../utils/randomId";
/**
 * these set are use to validate the request item information
 */
const createAllowed = new Set(["type", "orderId", "comment", "is_open"]);
const updateAllowed = new Set(["type", "orderId", "comment", "is_open"]);
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
 * create new product request
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the new cretated product request object
 */
export const create =
  ({ db, ws }) =>
  async (req, res) => {
    try {
      // validate only alowed properties are inserted
      const valid = Object.keys(req.body).every((k) => createAllowed.has(k));
      if (!valid) return res.status(400).send("Bad request, Validation failed");

      ws.on("create support", (data) => {
        console.log("data", data);
      });
      return;
      // insert data in support collection
      const support = await db.create({
        table: Support,
        key: { ...req.body, user: req.user.id },
      });

      res.send(support);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  };

/**
 * get all suport items
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the request item list
 */
export const getSupportList =
  ({ db }) =>
  (req, res) => {
    try {
      const { type, is_open } = req.query;
      console.log(type);
      db.find({
        table: Support,
        key: {
          allowedQuery,
          paginate: req.query.paginate === "true",
          populate: { path: "user", select: "full_name" },
          $or: [type && { type }, is_open && { is_open }],
        },
      })
        .then((request) => {
          res.status(200).send(request);
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
