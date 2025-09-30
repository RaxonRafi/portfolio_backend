import { Role } from "@prisma/client";
import express from "express";
import multer from "multer";
import { requireAuth, requireRole } from "../../middleware/auth";
import { PostController } from "./post.controller";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Unsupported file type"));
    }
    cb(null, true);
  },
});

router.post(
  "/",
  requireAuth,
  requireRole(Role.ADMIN),
  upload.single("thumbnail"),
  PostController.createPost
);

router.get("/", PostController.getPosts);
router.get("/:id", PostController.getPostById);
router.patch(
  "/:id",
  requireAuth,
  requireRole(Role.ADMIN),
  PostController.updatePost
);
router.delete(
  "/:id",
  requireAuth,
  requireRole(Role.ADMIN),
  PostController.deletePost
);


export const postRouter = router;
