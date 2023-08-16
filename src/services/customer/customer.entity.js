import User from "../user/user.schema";
import Order from "../order/order.schema";
import fs from "fs";
import xlsx from "node-xlsx";
import exceljs from "exceljs";
import path from "path";

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
      const { page = 1, perPage = 10 } = req.query;

      const stage = [
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
        {
          $project: {
            orders: 0,
          },
        },
      ];

      if (req.query.paginate === "true") {
        stage.push(
          {
            $skip: (parseInt(page) - 1) * parseInt(perPage),
          },
          {
            $limit: parseInt(perPage),
          }
        );
      }

      const user = await User.aggregate(stage);

      res.send({ docs: user, currentPage: page, Limit: perPage });
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

/**
 * get customer data
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the customer data server download link
 */
export const exportCustomerData =
  ({ db }) =>
  async (req, res) => {
    try {
      const users = await db.find({
        table: User,
        key: {
          paginate: false,
        },
      });

      const workBook = new exceljs.Workbook();

      const workSheet = workBook.addWorksheet("customer_sheet");

      workSheet.columns = [
        { header: "SL", key: "sl", width: 10 },
        { header: "Full Name", key: "full_name", width: 20 },
        { header: "Email", key: "email", width: 10 },
        { header: "Phone", key: "phone", width: 10 },
      ];

      let counter = 1;

      users.forEach((user) => {
        user.sl = counter;
        workSheet.addRow(user);
        counter++;
      });

      const directory = `${path.resolve()}/files`;
      if (!fs.existsSync(directory)) fs.mkdirSync(directory);
      const { format } = req.query;

      if (!["xlsx", "csv"].includes(format)) {
        return res
          .status(400)
          .send({ message: "Format only xlsx,csv are Allowed" });
      }

      try {
        await workBook[format]
          .writeFile(`${directory}/customer.${format}`)
          .then(() => {
            res.send({ downloadLink: `files/customer.${format}` });
          })
          .catch((err) => {
            res.send({ err });
          });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };
