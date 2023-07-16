import { Schema, model } from "mongoose";

const schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  paymentId: {
    type: String,
    required: true,
    unique: true,
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  ],
  status: {
    type: String,
    required: true,
    enum: ["pending", "processing", "shipping", "completed", "canceld"],
    default: "pending",
  },
  deliveryLastDate: {
    type: Date,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
});

export default model("Order", schema);
