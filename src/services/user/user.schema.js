import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    role: {
      type: String,
      required: true,
      enum: ["super-admin", "admin", "staff", "customer"],
      default: "customer",
    },
    password: { type: String, required: true },
    phone: { type: String },
    status: { type: String, enum: ["active", "deactive"] },
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "shippingAddress",
    },
    billingAddress: {
      type: Schema.Types.ObjectId,
      ref: "billingAddress",
    },
  },
  { timestamps: true, versionKey: false }
);

schema.plugin(paginate);
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
