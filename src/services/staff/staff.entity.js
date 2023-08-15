import randomId from "../../utils/randomId";
import bcrypt from "bcrypt";
import User from "../user/user.schema";
import Access from "./access.schema";

/**
 * create new staff request
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of product
 * @returns { Object } returns the new cretated staff
 */
export const create =
  ({ db, mail }) =>
  async (req, res) => {
    try {
      // validate only alowed properties are inserted
      const valid = Object.keys(req.body).every((k) =>
        new Set(["firstName", "lastName", "email", "phone", "role"]).has(k)
      );

      const { firstName, lastName, email, phone, role } = req.body;

      if (!valid) return res.status(400).send("Bad request, Validation failed");

      const generatePass = randomId(7);
      const hashedPass = await bcrypt.hash(generatePass, 8);

      db.create({
        table: User,
        key: {
          full_name: firstName + " " + lastName,
          email,
          phone,
          role,
          password: hashedPass,
        },
      })
        .then(async (user) => {
          const sendMail = await mail({
            receiver: user.email,
            subject: `Project Packers Added you as Staff`,
            body: `Welcome ${user.full_name}, Your are new member ${user.role} Project Packers`,
            type: "text",
          });
          res.status(200).send({ user, sendMail });
        })
        .catch(({ message }) => res.status(400).send({ message }));
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  };

/**
 * create a user access
 * @param { Object } db the db object for interacting with the database
 * @param { Object } req the request object containing the properties of category
 * @returns { Object } returns the new  database access object
 */
export const createAccess =
  ({ db }) =>
  async (req, res) => {
    try {
      db.create({ table: Access, key: req.body })
        .then((access) => {
          res.status(201).send(access);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Something went wrong");
        });
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  };
