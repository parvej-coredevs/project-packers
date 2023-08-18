import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./user.schema";
import otpGenerate from "../../utils/otpGenerate";
import { decryptData, encryptData } from "../../utils/Token";
import settings from "../../../settings.json";

/**
 * these are the set to validate the request body or query.
 */
const createAllowed = new Set([
  "full_name",
  "email",
  "avatar",
  "password",
  "role",
  "status",
  "phone",
]);
const allowedQuery = new Set(["full_name", "email"]);
const ownUpdateAllowed = new Set([
  "full_name",
  "avatar",
  "password",
  "role",
  "status",
  "phone",
]);

/**
 * Creates a new user in the database with the specified properties in the request body.
 * The 'role' property is automatically set to 'user', and the 'password' property is hashed using bcrypt.
 *
 * @param {Object} req - The request object containing the properties for the new user.
 * @param {Object} db - The database object for interacting with the database.
 * @returns {Object} The created user object, including the JWT token.
 * @throws {Error} If the request body includes properties other than those allowed or if there is an error during the database operation.
 */
export const register =
  ({ db, lyra }) =>
  async (req, res) => {
    try {
      const valid = Object.keys(req.body).every((k) => createAllowed.has(k));
      if (!valid) return res.status(400).send("Bad request");
      req.body.password = await bcrypt.hash(req.body.password, 8);

      const checkMail = await db.findOne({
        table: User,
        key: { email: req.body.email },
      });

      if (checkMail)
        return res.status(400).send({ message: "Email Alredy Exists" });

      db.create({
        table: User,
        key: req.body,
      })
        .then((user) => {
          res.status(200).send(user);
        })
        .catch(({ message }) => res.status(400).send({ message }));
    } catch (e) {
      console.log(e);
      res.status(500).send("Something went wrong.");
    }
  };

/**
 * This function is used for login a user.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const login =
  ({ db, settings, ws }) =>
  async (req, res, next) => {
    try {
      if (!req.body.email || !req.body.password)
        return res.status(400).send("Bad requests");
      const user = await db.findOne({
        table: User,
        key: { email: req.body.email },
      });
      if (!user) return res.status(401).send("Invalid Email Address");
      const isValid = await bcrypt.compare(req.body.password, user.password);
      if (!isValid) return res.status(401).send("Invalid Password");
      const token = jwt.sign({ id: user.id }, settings.token_secret);

      if (user.role === "staff") {
        if (req.session.staff !== undefined) {
          req.session.staff.push(`${user.id}`);
        } else {
          req.session.staff = [`${user.id}`];
        }
      }

      req.session.save(function (err) {
        if (err) return next(err);

        res.cookie(settings.token_key, token, {
          httpOnly: true,
          ...(settings.useHTTP2 && {
            sameSite: "None",
            secure: true,
          }),
          ...(!req.body.rememberMe && {
            expires: new Date(Date.now() + 172800000 /*2 days*/),
          }),
        });

        res.status(200).send(token);
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  };

/**
 * This function is used for load a user profile from request header.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const me = () => async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

/**
 * This function is used for logout a user.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const logout =
  ({ settings }) =>
  async (req, res, next) => {
    try {
      if (req.user.role === "staff") {
        req.session.staff = req.session.staff.filter(
          (item) => item !== req.user._id.toString()
        );
      }

      req.session.save(function (err) {
        if (err) {
          return next(err);
        }

        res.clearCookie("token", {
          httpOnly: true,
          ...(settings.useHTTP2 && {
            sameSite: "None",
            secure: true,
          }),
          expires: new Date(Date.now()),
        });

        console.log("from logout session", req.session);

        res.status(200).send("Logout successful");
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  };

/**
 * This function is used get all users in the database by query.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns a object, that contains resulted data and other information like page, limit.
 */
export const getAll =
  ({ db }) =>
  async (req, res) => {
    try {
      const users = await db.find({
        table: User,
        key: {
          query: req.query,
          allowedQuery: allowedQuery,
          paginate: req.query.paginate === "true",
        },
      });
      res.status(200).send(users);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  };

/**
 * This function is used to find a user by id.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data of the id otherwise no result found with status 404 .
 */
export const userProfile =
  ({ db }) =>
  async (req, res) => {
    try {
      const user = await db.findOne({
        table: User,
        key: {
          id: req.params.id,
          // populate: { path: "role", select: "name department" },
        },
      });
      if (!user) return res.status(404).send("No result found");
      res.status(200).send(user);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  };

const setPassword = async ({ oldPass, newPass, user }) => {
  if (!oldPass || !newPass) throw { status: 400, reason: "bad request" };
  const isValid = await bcrypt.compare(oldPass, user.password);
  if (!isValid) throw { status: 401, reason: "Invalid old Password" };
  return await bcrypt.hash(newPass, 8);
};

/**
 * This function is used to update user own profile.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the updated data.
 */
export const updateOwn =
  ({ db, imageUp }) =>
  async (req, res) => {
    try {
      if (req.files?.avatar?.path) {
        req.body = JSON.parse(req.body.data || "{}");
        req.body.avatar = await imageUp(req.files?.avatar.path);
      }
      const isValid = Object.keys(req.body).every((k) =>
        ownUpdateAllowed.has(k)
      );
      if (!isValid) return res.status(400).send("Bad request");
      if (req.body.passwordChange) {
        req.body.password = await setPassword({
          oldPass: req.body.passwordChange.oldPass,
          newPass: req.body.passwordChange.newPass,
          user: req.user,
        });
        delete req.body.passwordChange;
      }
      Object.keys(req.body).forEach((k) => (req.user[k] = req.body[k]));
      await db.save(req.user);
      res.status(200).send(req.user);
    } catch (err) {
      console.log(err);
      res.status(err.status || 500).send(err.reason || "Something went wrong");
    }
  };

/**
 * This function is used update a user by admin, admin can update without only password and notifySubs.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the updated data.
 */
export const updateUser =
  ({ db, imageUp }) =>
  async (req, res) => {
    try {
      req.body = JSON.parse(req.body.data || "{}");
      if (req.files?.avatar?.path) {
        req.body.avatar = await imageUp(req.files?.avatar.path);
      }
      const user = await db.findOne({
        table: User,
        key: { id: req.params.id },
      });
      if (!user) return res.status(400).send("Bad request");
      if (req.body.password)
        req.body.password = await bcrypt.hash(req.body.password, 8);
      Object.keys(req.body).forEach((k) => (user[k] = req.body[k]));
      await db.save(user);
      res.status(200).send(user);
    } catch (err) {
      console.log(err);
      res.status(err.status || 500).send(err.reason || "Something went wrong");
    }
  };

export const remove =
  ({ db }) =>
  async (req, res) => {
    try {
      const { id } = req.params;
      const user = await db.remove({ table: User, key: { id } });
      if (!user) return res.status(404).send({ messae: "User not found" });
      res.status(200).send({ message: "Deleted Successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Something went wrong" });
    }
  };

export const resetPassword =
  ({ db, mail }) =>
  async (req, res) => {
    try {
      const user = await db.findOne({
        table: User,
        key: { email: req.body.email },
      });
      if (!user)
        return res
          .status(404)
          .send({ messae: "Invalid Email, User not found" });

      const otp = otpGenerate();
      const token = `${encryptData(otp)}|${
        new Date().getTime() + 1000 * 60 * 5
      }`;

      // console.log(otp);
      // console.log(token);

      const sendMail = await mail({
        receiver: user.email,
        subject: "Reset Passwords",
        body: `Your Reset Password Code : ${otp}`,
        type: "text",
      });

      if (!sendMail) return res.status(500).send("Failed to reset password");
      res.status(200).send({ token });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Something went wrong" });
    }
  };

export const verifyOtp = () => async (req, res) => {
  try {
    const [token, expireTime] = req.body.token.split("|");
    const decryptToken = decryptData(token);
    const currentTime = new Date().getTime();

    if (currentTime > expireTime) {
      return res.status(500).send("OTP code is expired");
    }

    if (!decryptToken === req.body.code) {
      return res.status(500).send("Invalid OTP code");
    }

    const newToken = encryptData(settings.reset_pass_secret);

    res.status(200).send({ newToken });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};

export const updatePassword =
  ({ db }) =>
  async (req, res) => {
    try {
      const decryptToken = decryptData(req.body.token);

      if (!decryptToken === settings.token_secret) {
        return res.status(500).send({ message: "Invalid Request" });
      }

      if (req.body.password !== req.body.confirmPassword) {
        return res.status(500).send({ message: "Password Does Not Match" });
      }

      const user = await db.findOne({
        table: User,
        key: { email: req.body.email },
      });

      user.password = await bcrypt.hash(req.body.password, 8);
      await db.save(user);

      res.status(200).send({ message: "Password Successfully Updated" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Something went wrong" });
    }
  };
