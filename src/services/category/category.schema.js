import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String },
  },
  { timestamps: true, versionKey: false }
);

schema.plugin(paginate);

export default model("Category", schema);
