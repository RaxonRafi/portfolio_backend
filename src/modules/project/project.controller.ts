import { Request, Response } from "express";
import { ProjectService } from "./project.service";
import { uploadBufferToCloudinary, deleteImageFromCloudinary } from "../../config/cloudinary";

const createProject = async (req: Request, res: Response) => {
  try {
    // Parse body (JSON inside 'data' if multipart/form-data)
    let data: any = req.body || {};
    if (req.body?.data) {
      data = JSON.parse(req.body.data);
    }

    // Handle file upload
    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, `project-${Date.now()}`);
      if (uploadResult) {
        data.thumbnail = uploadResult.secure_url;
        data.thumbnailPublicId = uploadResult.public_id;
      }
    }

    const result = await ProjectService.createProject(data);
    res.status(201).json(result);
  } catch (error: any) {
    console.error("Create project error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const getProjects = async (_req: Request, res: Response) => {
  try {
    const result = await ProjectService.getProjects();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const getProjectById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await ProjectService.getProjectById(id);
    if (!result) return res.status(404).json({ message: "Project not found" });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const updateProject = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existingProject = await ProjectService.getProjectById(id);
    if (!existingProject) return res.status(404).json({ message: "Project not found" });

    let data: any = req.body || {};
    if (req.body?.data) {
      try {
        data = JSON.parse(req.body.data);
      } catch {
        return res.status(400).json({ message: "Invalid JSON in 'data' field" });
      }
    }

    if (req.file) {
      // Delete old image
      if (existingProject.thumbnail) {
        await deleteImageFromCloudinary(existingProject.thumbnail);
      }

      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, `project-${id}`);
      if (uploadResult) {
        data.thumbnail = uploadResult.secure_url;
        data.thumbnailPublicId = uploadResult.public_id;
      }
    }

    const result = await ProjectService.updateProject(id, data);
    res.json(result);
  } catch (error: any) {
    console.error("Update project error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const deleteProject = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const existingProject = await ProjectService.getProjectById(id);
    if (!existingProject) return res.status(404).json({ message: "Project not found" });

    if (existingProject.thumbnail) {
      await deleteImageFromCloudinary(existingProject.thumbnail);
    }

    const result = await ProjectService.deleteProject(id);
    res.json(result);
  } catch (error: any) {
    console.error("Delete project error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const ProjectController = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
