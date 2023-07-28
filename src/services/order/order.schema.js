import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
import autopopulate from "mongoose-autopopulate";
const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      autopopulate: true,
    },
    payment: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
        autopopulate: true,
      },
    ],
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Request",
        autopopulate: true,
      },
    ],
    status: {
      type: String,
      required: true,
      enum: [
        "paid",
        "unpaid",
        "processing",
        "shipping",
        "completed",
        "canceld",
      ],
      default: "unpaid",
    },
    deliveryDate: {
      type: Date,
    },
    note: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

schema.plugin(paginate);
schema.plugin(autopopulate);

export default model("Order", schema);
