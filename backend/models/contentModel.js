import mongoose, { Schema } from "mongoose";

const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  page: { type: Schema.Types.ObjectId, ref: "page", index: true },
});

const Content = mongoose.model("content", ContentSchema);

export default Content;
