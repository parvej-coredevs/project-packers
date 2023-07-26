import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    order: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    transactionDate: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

schema.plugin(paginate);
export default model("Payment", schema);
