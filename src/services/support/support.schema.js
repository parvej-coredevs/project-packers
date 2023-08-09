import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["account", "refund", "order", "payment"],
    },
    comment: {
      type: String,
      required: true,
    },
    is_open: {
      type: Boolean,
      default: true,
    },
  },
  { versionKey: false, timestamps: true }
);

schema.plugin(paginate);

export default model("Support", schema);
