import mongoose from "mongoose";

const postSectionSchema = new mongoose.Schema(
  {
    anchor: { type: String, required: true, trim: true },
    heading: { type: String, required: true, trim: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    coverImage: { type: String },
    coverImageAlt: { type: String, trim: true },
    author: { type: String, trim: true, default: "Equipo Petshop" },
    sections: { type: [postSectionSchema], default: [] },
    published: { type: Boolean, default: true },
  },
  { versionKey: false, timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
