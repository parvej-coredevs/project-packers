import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["account", "refund", "order", "payment"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
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
