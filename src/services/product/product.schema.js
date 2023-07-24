import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
import slugify from '../../utils/slugify';

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      // required: true,
    },
    link: {
      type: String,
      required: true,
    },
    from: {
      type: String,
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    category: [{
      type: Schema.Types.ObjectId,
      ref: "Category",
    }],
    sub_category: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    tags: {
      type: Array,
    },
    price: {
      type: Number,
    },
    comparePrice: {
      type: Number,
    },
    stock: {
      type: Number,
    },
    status: {
      type: String,
      required: true,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    moneyback_gurante: {
      type: Boolean,
    },
    images: {
      type: Array,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

schema.plugin(paginate);

schema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
})

export default model("Product", schema);
