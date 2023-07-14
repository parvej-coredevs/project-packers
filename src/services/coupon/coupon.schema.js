import { Schema, model } from "mongoose";

const schema = new Schema({
  couponCode: {
    type: String,
    required: true,
    unique: true,
  },
  discountType: {
    type: String,
    required: true,
    enum: ["fixed", "percentage"],
    default: "percentage",
  },
  discountAmount: {
    type: Number,
    required: true,
  },
  startingDate: {
    type: Date,
    required: true,
  },
  expiresDate: {
    type: Date,
    required: true,
  },
});

export default model("Payment", schema);
