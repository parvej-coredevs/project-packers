import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    valid_id: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    bank_tran_id: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["Abandoned", "Closed", "Pending"],
      default: "Pending",
    },
    method: {
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
