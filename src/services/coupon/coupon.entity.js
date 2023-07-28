import Coupon from "../coupon/coupon.schema";
import Product from "../product/product.schema";
import Request from "../request/request.schema";
import { getUserCheckoutInfo } from "../request/request.entity";
/**
 * these set are use to validate the request item information
 */
const createAllowed = new Set([
  "code",
  "description",
  "type",
  "minPurchase",
  "amount",
  "limit",
  "expireDate",
  "validCategory",
]);
const updateAllowed = new Set([
  "code",
  "description",
  "type",
  "minPurchase",
  "amount",
  "limit",
  "expireDate",
  "validCategory",
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
 * apply coupon in user cart
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the updated message
 */
export const couponApply =
  ({ db }) =>
  async (req, res) => {
    try {
      const coupon = await db.findOne({
        table: Coupon,
        key: {
          code: req.body.code,
        },
      });

      // check coupon is exist
      if (!Object.keys(coupon).length > 0)
        return res.status(404).send("Invalid Coupon Code");

      // check coupon limit
      if (coupon.limit < 0)
        return res.status(400).send("Coupon Limit Exceeded");

      // check coupon expires date
      if (new Date(coupon.expireDate).getTime() > new Date().getTime())
        return res.status(400).send("Coupon Date Expire");

      // retrive user cart data
      const requestItems = await getUserCheckoutInfo({
        Table: Request,
        match: { user: req.user._id, status: "estimate-send" },
      });

      if (!Object.keys(requestItems).length > 0) {
        return res
          .status(404)
          .send("Your are not eligible for applying coupon");
      }

      let eligibleProductTotalPrice = 0;

      for (let couponCategory of coupon.validCategory) {
        for (let requestItem of requestItems) {
          requestItem.product.sub_category.forEach((productCat) => {
            if (productCat._id.toString() === couponCategory.toString()) {
              eligibleProductTotalPrice += requestItem.productPrice;
            }
          });
        }
      }

      if (eligibleProductTotalPrice < coupon.minPurchase) {
        return res
          .status(400)
          .send(`Please Minimum Purchase more than ${coupon.minPurchase} TK`);
      }

      res.status(200).send({ requestItems, eligibleProductTotalPrice });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  };

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
          res.status(200).send(coupon);
        })
        .catch(({ message }) => res.status(400).send({ message }));
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  };

/**
 * get all coupon list
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the coupon item list
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
          populate: {
            path: "validCategory",
            select: "name",
          },
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
  ({ db }) =>
  async (req, res) => {
    try {
      // validate only updateAllowed properties
      const valid = Object.keys(req.body).every((k) => updateAllowed.has(k));
      if (!valid) return res.status(400).send("Bad request, Validation failed");

      // find request item
      const coupon = await db.findOne({
        table: Coupon,
        key: { code: req.params.code },
      });

      // check coupon is exist
      if (!coupon) return res.status(404).send("Invalid Coupon ID");

      db.update({
        table: Coupon,
        key: { code: req.params.code, body: req.body },
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

/**
 * delete coupon
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the sucesss message
 */
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
