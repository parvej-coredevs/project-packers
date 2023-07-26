import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Request",
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "shipping", "completed", "canceld"],
      default: "pending",
    },
    deliveryDate: {
      form: {
        type: Date,
      },
      to: {
        type: Date,
      },
    },
    note: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

schema.plugin(paginate);

export default model("Order", schema);
