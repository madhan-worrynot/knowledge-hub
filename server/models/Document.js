import mongoose from "mongoose";

// Schema for document version history
const versionSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    summary: String,
    tags: [String],
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [String],
    summary: { type: String },
    embedding: {
      type: [Number],
      default: [],
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    versions: { type: [versionSchema], default: [] } // ✅ ensure it's always an array
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);
export default Document;
