import Order from "../order/order.schema";
import Product from "../product/product.schema";
import Request from "../request/request.schema";
/**
 * these set are use to validate the request item information
 */
const createAllowed = new Set([
  "user",
  "payment",
  "items",
  "orderId",
  "status",
  "note",
]);
const updateAllowed = new Set([
  "payment",
  "items",
  "status",
  "note",
  "deliveryDate",
]);
const allowedQuery = new Set([
  "items",
  "status",
  "deliveryDate",
  "_id",
  "search",
  "page",
  "limit",
  "id",
  "paginate",
]);
/**
 * get all orders for admin dashboard
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the order list
 */
export const getAllOrder =
  ({ db }) =>
  (req, res) => {
    try {
      db.find({
        table: Order,
        key: {
          allowedQuery,
          paginate: req.query.paginate === "true",
        },
      })
        .then(async (order) => {
          res.status(200).send(order);
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
 * update coupon data
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the coupon data object
 */
export const updateCoupon =
  ({ db, imageUp }) =>
  async (req, res) => {
    try {
      // validate only updateAllowed properties
      const valid = Object.keys(req.body).every((k) => updateAllowed.has(k));
      if (!valid) return res.status(400).send("Bad request, Validation failed");

      // find request item
      const coupon = await db.findOne({
        table: Coupon,
        key: { id: req.params.id },
      });

      // check coupon is exist
      if (!coupon) return res.status(404).send("Invalid Coupon ID");

      db.update({
        table: Coupon,
        key: { id: req.params.id, body: req.body },
      })
        .then((coupon) => {
          res.status(200).send(coupon);
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

// /**
//  * delete request
//  * @param { Object } db the db object for interacting with the database
//  * @param { Object } req the request object containing the properties of product
//  * @returns { Object } returns the sucesss message
//  */
export const deleteCoupon =
  ({ db }) =>
  async (req, res) => {
    try {
      await db.remove({
        table: Coupon,
        key: { id: req.params.id },
      });

      res.status(200).send({ message: "Deleted Successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Something went wrong" });
    }
  };
