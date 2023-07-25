import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    city: { type: String },
    area: { type: String },
    zip: { type: String },
  },
  { versionKey: false }
);

export default model("billingAddress", schema);
