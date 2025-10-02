import { Request, Response } from "express";
import { ProjectService } from "./project.service";

const createProject = async (req: Request, res: Response) => {
  try {
    // Parse JSON data if sent as 'data' field (for multipart/form-data)
    let data = req.body;
    if (req.body.data) {
      data = JSON.parse(req.body.data);
    }

    if (req.file) {
      const { Readable } = await import("stream");
      const { cloudinary } = await import("../../config/cloudinary");
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);
      const uploadResult: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "portfolio-projects" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        bufferStream.pipe(stream);
      });
      data.thumbnail = uploadResult.secure_url;
    }
    const result = await ProjectService.createProject(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProjects = async (_req: Request, res: Response) => {
  try {
    const result = await ProjectService.getProjects();
    res.json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProjectById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await ProjectService.getProjectById(id);
    if (!result) return res.status(404).json({ message: "Project not found" });
    res.json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateProject = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await ProjectService.updateProject(id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteProject = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await ProjectService.deleteProject(id);
    res.json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const ProjectController = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
