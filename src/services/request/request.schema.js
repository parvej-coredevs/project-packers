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
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
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
      form: {
        type: Date,
      },
      to: {
        type: Date,
      },
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

export default model("Request", schema);
