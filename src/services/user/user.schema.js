import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
import autopopulate from "mongoose-autopopulate";

const schema = new Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, unique: true },
    avatar: { type: String },
    role: {
      type: String,
      required: true,
      enum: ["super-admin", "admin", "staff", "support-agent", "customer"],
      default: "customer",
    },
    password: { type: String },
    phone: { type: String },
    status: { type: String, enum: ["active", "deactive"], default: "active" },
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "shippingAddress",
      autopopulate: true,
    },
    billingAddress: {
      type: Schema.Types.ObjectId,
      ref: "billingAddress",
      autopopulate: true,
    },
    social_id: { type: String },
    provider: { type: String },
  },
  { timestamps: true, versionKey: false }
);

schema.plugin(paginate);
schema.plugin(autopopulate);

schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.password;
  delete obj.notifySubs;
  return JSON.parse(JSON.stringify(obj).replace(/_id/g, "id"));
};

export default model("User", schema);
