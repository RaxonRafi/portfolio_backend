import { Role } from "@prisma/client";
import express from "express";
import multer from "multer";
import { requireAuth, requireRole } from "../../middleware/auth";
import { ProjectController } from "./project.controller";

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
  ProjectController.createProject
);
router.get("/", ProjectController.getProjects);
router.get("/:id", ProjectController.getProjectById);
router.patch("/:id", ProjectController.updateProject);
router.delete("/:id", ProjectController.deleteProject);



export const projectRouter = router;
