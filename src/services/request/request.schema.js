import { model, Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import autopopulate from "mongoose-autopopulate";

const schema = new Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // autopopulate: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      autopopulate: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "estimate-send", "closed", "abandoned"],
      default: "pending",
    },
    seller_takes: {
      type: Number,
    },
    sales_taxs: {
      type: Number,
    },
    packers_fee: {
      type: Number,
    },
    // shipping_fee: {
    //   type: Number,
    // },
    // grandTotal: {
    //   type: Number,
    // },
    aprox_delivery: {
      type: String,
    },
    couponApplied: {
      type: Boolean,
      default: false,
    },
    discountAmount: {
      type: Number,
    },
  },
  { versionKey: false, timestamps: true }
);

schema.plugin(paginate);
schema.plugin(autopopulate);

export default model("Request", schema);
