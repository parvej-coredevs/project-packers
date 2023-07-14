import { Schema, model } from "mongoose";

const schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  items: {
    type: [Schema.Types.ObjectId],
    ref: "Product",
  },
});
