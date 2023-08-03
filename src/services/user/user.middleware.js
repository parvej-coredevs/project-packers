import jwt from "jsonwebtoken";
import settings from "../../../settings.json";

export const socialUsreRespose = (req, res, next) => {
  try {
    const token = jwt.sign({ id: req.user.id }, settings.token_secret);

    res.cookie(settings.token_key, token, {
      httpOnly: true,
      ...(settings.useHTTP2 && {
        sameSite: "None",
        secure: true,
      }),
    });
    res.send({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};
