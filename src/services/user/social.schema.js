import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    displayName: { type: String },
    email: { type: String },
    provider: { type: String },
    profile_id: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export default model("SocialUser", schema);
