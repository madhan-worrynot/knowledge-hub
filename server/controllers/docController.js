// controllers/docController.js
import Document from "../models/Document.js";
import Activity from "../models/Activity.js";
import { generateSummary, generateTags, generateEmbedding } from "../utils/gemini.js";

// Create Document
export const createDoc = async (req, res) => {
  try {
    const { title, content } = req.body;

    const summary = await generateSummary(content);
    const tags = await generateTags(content);
    const embedding = await generateEmbedding(content);

    const doc = await Document.create({
      title,
      content,
      tags,
      summary,
      embedding,
      createdBy: req.user._id,
    });

    await Activity.create({ user: req.user._id, action: "created", doc: doc._id });
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Docs
export const getDocs = async (req, res) => {
  try {
    const docs = await Document.find().populate("createdBy", "name email");
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get single document by ID
export const getDocById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id).populate("createdBy", "name email");
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Text Search with optional tag filter
export const searchDocs = async (req, res) => {
  try {
    const { q, tags } = req.query;

    const searchConditions = [];

    if (q) {
      searchConditions.push({
        $or: [
          { title: { $regex: q, $options: "i" } },
          { content: { $regex: q, $options: "i" } },
        ],
      });
    }

    if (tags) {
      const tagArray = tags.split(","); // frontend sends tags as comma-separated
      searchConditions.push({ tags: { $in: tagArray } });
    }

    const docs = await Document.find(
      searchConditions.length ? { $and: searchConditions } : {}
    );

    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update Doc (with versioning)
export const updateDoc = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (req.user.role !== "admin" && doc.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Save old version
    doc.versions.push({
      title: doc.title,
      content: doc.content,
      summary: doc.summary,
      tags: doc.tags,
      updatedAt: new Date(),
    });

    doc.title = req.body.title || doc.title;
    doc.content = req.body.content || doc.content;

    if (req.body.content) {
      doc.summary = await generateSummary(req.body.content);
      doc.tags = await generateTags(req.body.content);
      doc.embedding = await generateEmbedding(req.body.content);
    }

    await doc.save();
    await Activity.create({ user: req.user._id, action: "updated", doc: doc._id });

    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Doc
export const deleteDoc = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (req.user.role !== "admin" && doc.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await doc.deleteOne();
    await Activity.create({ user: req.user._id, action: "deleted", doc: req.params.id });

    res.json({ message: "Document removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Summarize
export const summarizeDoc = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    doc.summary = await generateSummary(doc.content);
    await doc.save();

    await Activity.create({ user: req.user._id, action: "summarized", doc: doc._id });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tag
export const tagDoc = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    doc.tags = await generateTags(doc.content);
    await doc.save();

    await Activity.create({ user: req.user._id, action: "tagged", doc: doc._id });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Semantic Search
export const semanticSearchDocs = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Query is required" });

    const queryEmbedding = await generateEmbedding(q);
    const docs = await Document.find();

    const cosineSimilarity = (a, b) => {
      if (!a.length || !b.length) return 0;
      const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
      const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
      return normA && normB ? dot / (normA * normB) : 0;
    };

    const ranked = docs
      .map((doc) => ({ doc, score: cosineSimilarity(queryEmbedding, doc.embedding || []) }))
      .sort((a, b) => b.score - a.score);

    res.json(ranked.map((r) => ({ ...r.doc._doc, score: r.score })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Q&A
export const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: "Question required" });

    const queryEmbedding = await generateEmbedding(question);
    const docs = await Document.find();

    const cosineSimilarity = (a, b) => {
      if (!a.length || !b.length) return 0;
      const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
      const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
      return normA && normB ? dot / (normA * normB) : 0;
    };

    const ranked = docs
      .map((doc) => ({ doc, score: cosineSimilarity(queryEmbedding, doc.embedding || []) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const context = ranked.map((r) => r.doc.content).join("\n\n");
    const prompt = `Answer the question using the following documents as context:\n\n${context}\n\nQuestion: ${question}`;

    const result = await generateSummary(prompt);

    await Activity.create({ user: req.user._id, action: "asked question", doc: ranked[0]?.doc._id });
    res.json({ answer: result, sources: ranked.map((r) => r.doc.title) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Activity Feed
export const getActivityFeed = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("user", "name email")
      .populate("doc", "title")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Document Versions
export const getDocVersions = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    res.json(doc.versions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
