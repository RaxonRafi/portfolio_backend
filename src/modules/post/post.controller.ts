import { Request, Response } from "express";
import { PostMutation, PostQuery, PostService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    // If a file is uploaded under field name "thumbnail", upload to Cloudinary first
    if (req.file) {
      const { Readable } = await import("stream");
      const { cloudinaryUpload  } = await import("../../config/cloudinary");
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);
      const uploadResult: any = await new Promise((resolve, reject) => {
        const stream = cloudinaryUpload .uploader.upload_stream(
          { folder: "blog-posts" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        bufferStream.pipe(stream);
      });
      (req.body as any).thumbnail = uploadResult.secure_url;
    }

    const result = await PostService.createPost(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const PostController = {
  createPost,
  getPosts: async (_req: Request, res: Response) => {
    try {
      const result = await PostQuery.getPosts();
      res.json(result);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  getPostById: async (req: Request, res: Response) => {
    try {
      const result = await PostQuery.getPostById(Number(req.params.id));
      if (!result) return res.status(404).json({ message: "Post not found" });
      res.json(result);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  updatePost: async (req: Request, res: Response) => {
    try {
      const result = await PostMutation.updatePost(
        Number(req.params.id),
        req.body
      );
      res.json(result);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  deletePost: async (req: Request, res: Response) => {
    try {
      const result = await PostMutation.deletePost(Number(req.params.id));
      res.json(result);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
