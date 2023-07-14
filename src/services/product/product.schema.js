import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
import slugify from "../../utils/slugify";

const schema = new Schema({
  title: {
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
  regulaPrice: {
    type: Number,
    required: true,
  },
  salePrice: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  sold: {
    type: Number,
    required: true,
  },
  productLink: {
    type: String,
    required: true,
  },
  deliveryTime: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    default: 3,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "published"],
    default: "pending",
  },
  images: {
    type: Array,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
});

schema.plugin(paginate);

schema.pre("save", function (next) {
  this.slug = slugify(this.title);
  next();
});
