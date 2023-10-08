import mongoose, { Schema } from "mongoose";

const NotebookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "user" },
  page: [{ type: Schema.Types.ObjectId, ref: "page", required: false }],
});

const Notebook = mongoose.model("Notebook", NotebookSchema);

export default Notebook;
