import Cart from "./cart.schema";
import Coupon from "../coupon/coupon.schema";
import Request from "../request/request.schema";
import User from "../user/user.schema";
import shippingAddress from "../user/shipping.schema";
import Payment from "../payment/payment.schema";
import Order from "../order/order.schema";
import trxId from "../../utils/trxId";
import randomId from "../../utils/randomId";
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
 * this function only used for calculate product price
 * @param { Object } query the query object is use to find user cart item
 * @example { user: userId }
 */
export async function productPriceCalculate(cart) {
  try {
    return await cart.request.reduce(
      (total, item) => (total += item.product.price * item.quantity),
      0
    );
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

      if (!carts) {
        return res.status(404).send("Cart Not Found");
      }

      if (carts.couponApplied) {
        return res.status(400).send("Coupon Already Applied");
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

      if (eligibleProductTotalPrice === 0) {
        return res
          .status(400)
          .send({ message: "You are not eligible for this coupon" });
      }

      // check user is fullfilled minimum puchase condition
      if (eligibleProductTotalPrice < coupon.minPurchase) {
        return res.status(400).send({
          message: `Please Purchase more than ${coupon.minPurchase} TK`,
        });
      }

      // decrease coupon limit
      coupon.limit = coupon.limit - 1;

      // calculate user total discount
      const discamount = calculateDiscountAmount(
        coupon,
        eligibleProductTotalPrice
      );

      carts.discountAmount = Math.ceil(discamount);
      carts.couponApplied = true;

      await Promise.all([db.save(carts), db.save(coupon)]);
      // await db.save(carts);
      // await db.save(coupon);

      res.status(200).send({ carts, coupon });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  };

// get discount ammount based on coupon type
function calculateDiscountAmount(coupon, totalPrice) {
  if (coupon.type === "fixed") {
    return coupon.amount;
  } else if (coupon.type === "percentage") {
    return (totalPrice * coupon.amount) / 100;
  } else {
    throw new Error("Unknown coupon type.");
  }
}

/**
 * initiate checkout request
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the existing product request object
 */
export const initiatePaymentCheckout =
  ({ db, payment, settings }) =>
  async (req, res) => {
    try {
      // add shipping address
      db.create({
        table: shippingAddress,
        key: req.body.shippingAddress,
      }).then(async (shipping) => {
        const user = await db.findOne({
          table: User,
          key: { _id: req.user._id },
        });
        user.shippingAddress = shipping._id;
        db.save(user);
      });

      // get user cart items
      const carts = await Cart.findOne({ user: req.user._id });
      if (!carts)
        return res
          .status(404)
          .send({ message: "Please Add Request Item In Your Cart" });

      // generate request _id array for order.items field
      const orderItems = [];
      carts.request.forEach((Item) => {
        orderItems.push(Item._id.toString());
      });

      // add shipping fee
      const shipping_fee = req.body.inside_dhaka === "yes" ? 100 : 150;

      // initiate payment
      const initiatePayment = await payment.init({
        total_amount: carts.totalAmount + shipping_fee - carts.discountAmount,
        currency: "BDT",
        tran_id: trxId(),
        success_url: `${settings.hosturl}/checkout-success`,
        cancel_url: `${settings.hosturl}/checkout-cancel`,
        fail_url: `${settings.hosturl}/checkout-fail`,
        ipn_url: `${settings.hosturl}/checkout-ipn`,
        product_category:
          carts?.request[0]?.product?.sub_category?.join(", ") || "General",
        product_name:
          carts.request.reduce(
            (name, item) => (name += item?.product?.name + " | "),
            ""
          ) || "General",
        product_profile: "General",
        cus_name: carts.user.full_name || "",
        cus_email: req.body.contactInfo.email || "",
        cus_add1:
          carts.user?.shippingAddress?.address ||
          req.body.shippingAddress.address,
        cus_city:
          carts.user?.shippingAddress?.city || req.body.shippingAddress.city,
        cus_state:
          carts.user?.shippingAddress?.area || req.body.shippingAddress.area,
        cus_postcode:
          carts.user?.shippingAddress?.zip || req.body.shippingAddress.zip,
        cus_country:
          carts.user?.shippingAddress?.city || req.body.shippingAddress.city,
        cus_phone: req.body.contactInfo.phone || "",
        shipping_method: "No",
        // ship_name: carts.user.full_name || "",
        // ship_add1: req.body.shippingAddress.address || "Dhaka",
        // ship_add2: req.body.shippingAddress.address || "Dhaka",
        // ship_city: req.body.shippingAddress.city,
        // ship_state: req.body.shippingAddress.area,
        // ship_postcode: req.body.shippingAddress.zip,
        // ship_country: "Bangladesh",
        value_a: req.user._id.toString(), // pass the user id for identify after payment which user pay
        value_b: req.body.note || "", // pass the order note if user add note
        value_c: orderItems.join(","), // pass the request item id for for cart schema items field.
        value_d: shipping_fee, // pass the shipping fee
      });

      res.status(200).send({ url: initiatePayment.GatewayPageURL });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  };

/**
 * payment success callback
 * @param { Object } payment the payment object interacting with payment related operations
 * @param { Object } req the request object containing the properties when user successfully payment
 * @returns { Object } returns the existing product request object
 */
export const checkoutSuccess =
  ({ db, payment }) =>
  async (req, res) => {
    try {
      // validate user payment
      const validate = await payment.validate({ val_id: req.body.val_id });

      if (validate.status !== ("VALID" || "VALIDATED")) {
        return res.status(400).send({ message: "Payment Validation Failed" });
      }

      const paymentData = await createPayment({
        user: validate.value_a,
        valid_id: validate.val_id,
        amount: validate.amount,
        bank_tran_id: validate.bank_tran_id,
        method: validate.card_brand,
        status:
          validate.status === "VALID" || "VALIDATED" ? "Closed" : "Pending",
        transactionId: validate.tran_id,
        transactionDate: validate.tran_date,
      });

      const order = await createOrder({
        user: validate.value_a,
        payment: paymentData._id,
        items: validate.value_c.split(","),
        status: paymentData.status === "Closed" ? "Paid" : "Unpaid",
        orderId: randomId(),
        note: validate.value_b,
        shipping_fee: validate.value_d,
      });

      paymentData.order = order._id;
      db.save(paymentData);

      // update request item status
      await updateRequestItemStatus({
        requestIds: validate.value_c.split(","),
        updateStatus: { status: "closed" },
      });

      // empty user car
      await Cart.deleteOne({ user: validate.value_a });

      res.redirect("https://google.com"); // redirect to success url
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  };

/**
 * this function used for update request item status. when user request a item and pay for this item update this rerquest item status.
 * @param { Object } data data object is payload of order collection
 */
export async function updateRequestItemStatus({ requestIds, updateStatus }) {
  try {
    return await Request.updateMany(
      { _id: { $in: requestIds } },
      { $set: updateStatus }
    );
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

/**
 * create payment
 * @param { Object } data object is payload of payment collection
 */
export async function createPayment(data) {
  try {
    return await Payment.create(data);
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

/**
 * create order
 * @param { Object } data data object is payload of order collection
 */
export async function createOrder(data) {
  try {
    return await Order.create(data);
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

/**
 * payment fail callback
 * @param { Object } payment the payment object interacting with payment related operations
 * @param { Object } req the request object containing the properties when user payment is failed
 * @returns { Object } returns the existing product request object
 */
export const checkoutFail =
  ({ db }) =>
  async (req, res) => {
    try {
      const payment = req.body;

      const paymentData = await createPayment({
        user: payment.value_a,
        amount: payment.amount,
        bank_tran_id: payment.bank_tran_id,
        method: payment.card_issuer,
        status: payment.status === "FAILED" ? "Abandoned" : "Pending",
        transactionId: payment.tran_id,
        transactionDate: payment.tran_date,
      });

      const order = await createOrder({
        user: payment.value_a,
        payment: paymentData._id,
        items: payment.value_c.split(","),
        status: paymentData.status !== "Closed" ? "Unpaid" : "Paid",
        orderId: randomId(),
        note: payment.value_b,
        shipping_fee: validate.value_d,
      });

      paymentData.order = order._id;
      db.save(paymentData);

      // update request item status
      await updateRequestItemStatus({
        requestIds: payment.value_c.split(","),
        updateStatus: { status: "abandoned" },
      });

      // empty user cart
      await Cart.deleteOne({ user: payment.value_a });

      res.redirect("https://twitter.com"); // redirect to failed url
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  };

/**
 * payment cancel callback
 * @param { Object } payment the payment object interacting with payment related operations
 * @param { Object } req the request object containing the properties when user payment is cancelled
 * @returns { Object } returns the existing product request object
 */
export const checkoutCancel = () => async (req, res) => {
  console.log("cancel data", req.body);
  res.redirect("htps://google.com"); // redirect to cancel url
};
