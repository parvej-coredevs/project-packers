import Cart from "./cart.schema";
import Coupon from "../coupon/coupon.schema";
import Request from "../request/request.schema";
/**
 * these set are use to validate the category name
 */
const allowedQuery = new Set([
  "user",
  "request",
  "search",
  "page",
  "limit",
  "id",
  "paginate",
]);

/**
 * get user cart items list
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of cart
 * @returns { Object } returns the cart items list
 */
export const getUserCart =
  ({ db }) =>
  async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user._id });
      res.send(cart);
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };

/**
 * update user cart quantity
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of cart
 * @returns { Object } returns the cart items list
 */
export const cartQuantityUpdate =
  ({ db }) =>
  async (req, res) => {
    try {
      const request = await Request.findOne({
        user: req.user._id,
        _id: req.body.requestId,
      });
      request.quantity = req.body.quantity;
      request.save();

      await productPriceCalculate({ user: req.user._id });

      res.status(200).send(request);
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };

async function productPriceCalculate(query) {
  try {
    const cart = await Cart.findOne(query);
    cart.totalAmount = cart.request.reduce((total, item) => {
      total += item.product.price * item.quantity;
    }, 0);
    cart.save();
  } catch (error) {
    throw new Error(error.message);
  }
}

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
      const coupon = await Coupon.findOne({ code: req.body.code });

      // check coupon is exist
      if (!coupon) return res.status(404).send("Coupon Not Found");

      // check coupon limit
      if (coupon.limit < 0)
        return res.status(400).send("Coupon Limit Exceeded");

      // check coupon expires date
      if (new Date(coupon.expireDate).getTime() > new Date().getTime())
        return res.status(400).send("Coupon Date Expire");

      // retrive user cart items
      const carts = await Cart.findOne({ user: req.user._id });

      if (!Object.keys(carts).length > 0) {
        return res
          .status(404)
          .send("Your are not eligible for applying coupon");
      }

      let eligibleProductTotalPrice = 0;

      // calculate only eligible product total price
      for (let couponCategory of coupon.validCategory) {
        for (let requestItem of carts.request) {
          requestItem.product.sub_category.forEach((productCat) => {
            if (productCat._id.toString() === couponCategory.toString()) {
              eligibleProductTotalPrice +=
                requestItem?.product?.price * requestItem?.quantity;
            }
          });
        }
      }

      // check user is fullfilled minimum puchase condition
      if (eligibleProductTotalPrice < coupon.minPurchase) {
        return res
          .status(400)
          .send(`Please Purchase more than ${coupon.minPurchase} TK`);
      }

      // decrease coupon limit
      coupon.limit = coupon.limit - 1;

      // calculate user total discount
      const discamomut = calculateDiscountAmount(
        coupon,
        eligibleProductTotalPrice
      );

      carts.discountAmount = Math.ceil(discamomut);
      carts.couponApplied = true;

      await db.save(carts);
      await db.save(coupon);

      res.status(200).send({ carts, coupon });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  };

// get discount ammount based on coupon type
function calculateDiscountAmount(coupon, totalPrice) {
  if (coupon.type === "fixed") {
    return Math.min(totalPrice, totalPrice - coupon.amount);
  } else if (coupon.type === "percentage") {
    const discountAmount = (totalPrice * coupon.amount) / 100;
    return Math.min(totalPrice, discountAmount);
  } else {
    throw new Error("Unknown coupon type.");
  }
}
