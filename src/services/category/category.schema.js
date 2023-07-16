import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
import slugify from "../../utils/slugify";

const schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
  },
  { timestamps: true, versionKey: false }
);

schema.plugin(paginate);

schema.pre("save", function (next) {
  this.slug = slugify(this.title);
  next();
});

export default model("Category", schema);
