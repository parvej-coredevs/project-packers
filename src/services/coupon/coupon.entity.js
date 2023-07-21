import Coupon from "../coupon/coupon.schema";
/**
 * these set are use to validate the request item information
 */
const createAllowed = new Set([
  "code",
  "type",
  "amount",
  "description",
  "limit",
  "expireDate",
  "validCategory",
  "validSubCategory",
]);
const updateAllowed = new Set([
  "code",
  "type",
  "amount",
  "description",
  "limit",
  "expireDate",
  "validCategory",
  "validSubCategory",
]);
const allowedQuery = new Set([
  "code",
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
 * create new coupon
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the new cretated coupon object
 */
export const create =
  ({ db }) =>
  async (req, res) => {
    try {
      // validate only alowed properties are inserted
      const valid = Object.keys(req.body).every((k) => createAllowed.has(k));
      if (!valid) return res.status(400).send("Bad request, Validation failed");

      // insert data in coupon table
      db.create({
        table: Coupon,
        key: req.body,
      })
        .then(async (coupon) => {
          await db.save(coupon);
          res.status(200).send(coupon);
        })
        .catch(({ message }) => res.status(400).send({ message }));
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  };

/**
 * get all request items
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the request item list
 */
export const getCoupon =
  ({ db }) =>
  (req, res) => {
    try {
      db.find({
        table: Coupon,
        key: {
          allowedQuery,
          paginate: req.query.paginate === "true",
          populate: { path: "validSubCategory", select: "name parentCat" },
        },
      })
        .then(async (request) => {
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
