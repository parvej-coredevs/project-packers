import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["fixed", "percentage"],
      default: "percentage",
    },
    minPurchase: {
      type: Number,
    },
    amount: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    expireDate: {
      type: Date,
      required: true,
    },
    validCategory: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

schema.plugin(paginate);

export default model("Coupon", schema);
