import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
import slugify from "../../utils/slugify";

const schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    parentCat: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { versionKey: false }
);

schema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

schema.plugin(paginate);

export default model("SubCategory", schema);
