import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    img: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    author: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      unique: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    usersLiked: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);
schema.pre("save", function (next) {
  this.url = this.title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
  next();
});
const blogs = mongoose.models.blogs || mongoose.model("blogs", schema);
export default blogs;
