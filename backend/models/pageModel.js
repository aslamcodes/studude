import mongoose, { Schema } from "mongoose";

const PageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: [{ type: Schema.Types.ObjectId, ref: "content", required: false }],
  notebook: {
    type: Schema.Types.ObjectId,
    ref: "notebook",
    required: true,
    index: true,
  },
});

const Page = mongoose.model("page", PageSchema);

export default Page;
