import { model, Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  {
    requestId: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productLink: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "estimate-send", "closed", "abandoned"],
      default: "pending",
    },
    note: {
      type: String,
    },
    aprox_delivery: {
      type: String,
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
    shipping_fee: {
      type: Number,
    },
    grandTotal: {
      type: Number,
    },
  },
  { versionKey: false, timestamps: true }
);

schema.plugin(paginate);

export default model("Request", schema);
