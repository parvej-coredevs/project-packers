import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  {
    name: { type: String, required: true },
    parentCat: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true, versionKey: false }
);

schema.plugin(paginate);

export default model("SubCategory", schema);
