import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    support: {
      type: Schema.Types.ObjectId,
      ref: "Support",
    },
    sender: {
      type: String,
      enum: ["customer", "agent"],
    },
    message: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

schema.plugin(paginate);

export default model("Message", schema);
