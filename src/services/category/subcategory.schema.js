import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    name: { type: String, required: true },
    parentCat: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true, versionKey: false }
);

export default model("SubCategory", schema);
