// models/docModel.js
import mongoose from "mongoose";

const versionSchema = mongoose.Schema({
  title: String,
  content: String,
  summary: String,
  tags: [String],
  updatedAt: { type: Date, default: Date.now }
});

const docSchema = mongoose.Schema({
  title: String,
  content: String,
  summary: String,
  tags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  versions: [versionSchema] // <-- Added for versioning
});

export default mongoose.model("Doc", docSchema);
