import { Schema, model } from "mongoose";
import autopopulate from "mongoose-autopopulate";
// import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      autopopulate: true,
      required: true,
    },
    request: [
      {
        type: Schema.Types.ObjectId,
        ref: "Request",
        unique: true,
        autopopulate: true,
      },
    ],
    totalAmount: { type: Number },
    discountAmount: { type: Number },
    couponApplied: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

schema.plugin(autopopulate);

export default model("Cart", schema);
