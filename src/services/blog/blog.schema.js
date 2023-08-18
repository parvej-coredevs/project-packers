import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
import autopopulate from "mongoose-autopopulate";
import slugify from "../../utils/slugify";

const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        autopopulate: true,
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

schema.plugin(paginate);
schema.plugin(autopopulate);

schema.pre("save", function (next) {
  this.slug = slugify(this.title);
  next();
});

export default model("Blog", schema);
