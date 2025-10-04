import express from "express";
import multer from "multer";
import { requireAuth } from "../../middleware/auth";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostBySlug,
  updatePost,
} from "./post.controller";
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.mimetype)) return cb(null, false);
    cb(null, true);
  },
});

router.post("/", requireAuth, upload.single("thumbnail"), createPost);
router.get("/", getAllPosts);
router.get("/slug/:slug", getPostBySlug);
router.patch("/:id", requireAuth, upload.single("thumbnail"), updatePost);
router.delete("/:id", requireAuth, deletePost);

export const postRouter = router;
