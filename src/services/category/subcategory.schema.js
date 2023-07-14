import { Schema, model } from "mongoose";
import slugify from "slugify";

const schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    parentCat: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true, versionKey: false }
);

schema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

export default model("SubCategory", schema);
