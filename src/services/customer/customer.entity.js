import User from "../user/user.schema";
import Order from "../order/order.schema";
import mongoose from "mongoose";
/**
 * these set are use to validate the request item information
 */

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
 * get all coupon list
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the coupon item list
 */
export const getCustomer =
  ({ db }) =>
  async (req, res) => {
    try {
      const user = await User.aggregate([
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "user",
            as: "orders",
          },
        },
        {
          $addFields: {
            totalOrder: {
              $cond: {
                if: { $isArray: "$orders" },
                then: { $size: "$orders" },
                else: 0,
              },
            },
          },
        },
        { $unwind: "$orders" },
        {
          $lookup: {
            from: "payments",
            localField: "orders.payment",
            foreignField: "_id",
            as: "orders.payment",
          },
        },
        { $unwind: "$orders.payment" },
        {
          $group: {
            _id: "$_id",
            full_name: { $first: "$full_name" },
            phone: { $first: "$phone" },
            orders: { $push: "$orders" },
            totalOrder: { $sum: 1 },
            amountSpent: { $sum: "$orders.payment.amount" },
          },
        },
      ]);

      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };

/**
 * get order by customer
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the customer order list
 */
export const getCustomerOrder =
  ({ db }) =>
  async (req, res) => {
    try {
      const user = await db.find({
        table: Order,
        key: {
          paginate: req.query.paginate === "true",
          user: req.params.userId,
        },
      });
      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };
