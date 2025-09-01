// routes/docRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  createDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  summarizeDoc, 
  tagDoc,
  getDocById, 
  searchDocs, 
  semanticSearchDocs, 
  askQuestion,
  getActivityFeed,
  getDocVersions  // <-- new controller
} from "../controllers/docController.js";

const router = express.Router();

// CRUD
router.post("/", protect, createDoc);
router.get("/", protect, getDocs);
router.put("/:id", protect, updateDoc);
router.delete("/:id", protect, deleteDoc);

// Get single doc
router.get("/:id", protect, getDocById);


// AI utilities
router.post("/:id/summarize", protect, summarizeDoc);
router.post("/:id/tags", protect, tagDoc);

// Search
router.get("/search/text", protect, searchDocs);
router.get("/search/semantic", protect, semanticSearchDocs);

// Q&A
router.post("/qa", protect, askQuestion);

// Activity Feed
router.get("/activity/feed", protect, getActivityFeed);

// ✅ Versioning
router.get("/:id/versions", protect, getDocVersions);

export default router;
