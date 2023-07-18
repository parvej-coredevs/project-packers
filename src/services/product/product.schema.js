import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    tags: {
      type: Array,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sub_category: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    comparePrice: {
      type: Number,
      required: true,
    },
    productLink: {
      type: String,
      required: true,
    },
    aprox_delivery: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    images: [
      {
        type: String,
      },
    ],
    seller_takes: {
      type: Number,
      required: true,
    },
    sales_taxs: {
      type: Number,
      required: true,
    },
    packers_fee: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

schema.plugin(paginate);

export default model("Product", schema);
