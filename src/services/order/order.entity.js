import Order from "../order/order.schema";
import Product from "../product/product.schema";
import Request from "../request/request.schema";
/**
 * these set are use to validate the request item information
 */
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
  "sortBy",
]);
// const updateAllowed = new Set(["payment", "items", "status", "note"]);
/**
 * get all orders for admin dashboard
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the order list
 */
export const getAllOrder =
  ({ db }) =>
  async (req, res) => {
    try {
      const query = {};
      if (req.query?.sortBy) query.sortBy = req.query?.sortBy;
      if (req.query?.page) query.page = req.query?.page;
      if (req.query?.limit) query.limit = req.query?.limit;

      // calculate date range
      const date = { createdAt: {} };
      if (req.query?.date) {
        const [starting, ending] = req.query.date.split("|");
        date.createdAt.$gte = starting;
        date.createdAt.$lte = ending || new Date();
      }

      db.find({
        table: Order,
        key: {
          allowedQuery,
          paginate: req.query?.paginate === "true",
          query,
          ...(req.query.date && date),
          ...(req.query.status && { status: req.query.status }),
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
 * get single order by order id
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of category
 * @returns { Object } returns the single order data object
 */
export const getSingleOrder =
  ({ db }) =>
  (req, res) => {
    try {
      db.findOne({
        table: Order,
        key: { _id: req.params.id },
      })
        .then((order) => {
          res.status(200).json(order);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Please provide a valid order ID.");
        });
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };

/**
 * update user order
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the coupon data object
 */
export const updateOrder =
  ({ db, mail }) =>
  async (req, res) => {
    try {
      // validate only updateAllowed properties
      const valid = Object.keys(req.body).every((k) =>
        new Set(["status", "note"]).has(k)
      );
      if (!valid) return res.status(400).send("Bad request, Validation failed");

      // find order item
      const order = await db.findOne({
        table: Order,
        key: { id: req.params.id },
      });

      // check order is exist
      if (!order) return res.status(404).send("Order Not Found");

      Object.keys(req.body).forEach((key) => (order[key] = req.body[key]));
      await db.save(order);

      const sendMail = await mail({
        receiver: order.user.email,
        subject: `Your Order Status Update - #${order.orderId}`,
        body: `Dear ${order.user.full_name},

We hope this email finds you well. We are writing to inform you about the recent update to your order with the following details:

Order Number: #${order.orderId}
Order Date: ${order.createdAt}
Updated Status: ${order.status}

We are pleased to confirm that your order has been ${order.status}, and it is now On its way to delivery. We are doing our best to ensure a smooth and timely delivery process.

If you have any questions or concerns regarding your order, please feel free to reach out to our customer support team. We are here to assist you.

Thank you for shopping with us. We truly value your business and look forward to serving you again soon.

Best regards,
Project Packer Team`,
        type: "text",
      });

      if (!sendMail) return res.status(500).send("Failed to send email");

      res.status(200).send(order);
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };

/**
 * delete order item
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the sucesss message
 */
export const deleteOrder =
  ({ db }) =>
  async (req, res) => {
    try {
      db.remove({
        table: Order,
        key: { id: req.params.id },
      })
        .then((order) => {
          res.status(200).send({ message: "Deleted Successfully", order });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({ message: err.message });
        });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Something went wrong" });
    }
  };

/**
 * this route is used for inititate refund for a order
 * @param { Object } db the db object for interacting with the database
 * @param { Object } payment is instance of ssl commerze packeage
 * @returns { Object } returns the sucesss message
 */
export const initiateRefund =
  ({ db, payment }) =>
  async (req, res) => {
    try {
      // find order item
      const order = await db.findOne({
        table: Order,
        key: { id: req.params.orderId },
      });

      if (!order) {
        return res.status(400).send({ message: "Invalid Order ID" });
      }

      // check order is successfully payment
      if (order.status === "Unpaid") {
        return res
          .status(400)
          .send({ message: "This order not eligible for refund" });
      }

      // check valid pay
      if (!order.payment.status === "Closed") {
        return res
          .status(400)
          .send({ message: "There are no successfull payment in this order" });
      }

      // initialize payment
      const refund = await payment.initiateRefund({
        bank_tran_id: order.payment.bank_tran_id,
        refund_amount: order.payment.amount,
        refund_remarks: order.note || "General",
        refe_id: order.orderId,
      });

      if (refund.status === "failed") {
        return res.status(400).send({
          message: "Your Refund request failed",
          reason: refund.errorReason,
        });
      }

      if (refund.status === "processing") {
        return res.status(400).send({
          message: "Your Refund request is processing",
        });
      }

      order.status = "Refunded";
      order.refund_ref_id = refund.refund_ref_id;

      db.save(order);

      res.send({ message: "Your Refund Request is Initialized", refund });
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };

/**
 * this route is used for check refund status
 * @param { Object } db the db object for interacting with the database
 * @param { Object } payment is instance of ssl commerze packeage
 * @returns { Object } returns the sucesss message
 */
export const refundStatus =
  ({ db, payment }) =>
  async (req, res) => {
    try {
      // find order item
      const order = await db.findOne({
        table: Order,
        key: { id: req.params.orderId },
      });

      if (!order) {
        return res.status(400).send({ message: "Invalid Order ID" });
      }

      // check order is successfully initiate refund request
      if (order.status !== "Refunded" || order.refund_ref_id === undefined) {
        return res
          .status(400)
          .send({ message: "Please initiate refund request" });
      }

      // initialize payment
      const refund = await payment.refundQuery({
        refund_ref_id: order.refund_ref_id,
      });

      res.send(refund);
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };
