import { Request, Response } from "express";
import sanitizeHtml from "sanitize-html";
import { uploadBufferToCloudinary } from "../../config/cloudinary";
import { PostMutation, PostQuery, PostService } from "./post.service";
import { createPostSchema } from "./post.validation";

const CLEAN = (dirty: string) =>
  sanitizeHtml(dirty, {
    allowedTags: [
      "p",
      "strong",
      "em",
      "u",
      "s",
      "blockquote",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "a",
      "code",
      "pre",
      "img",
      "br",
      "hr",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel", "data"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }),
    },
  });

export const createPost = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // If the frontend sends everything in a "data" field (Postman screenshot):
    let body: any = req.body;
    if (typeof body.data === "string") {
      try {
        body = JSON.parse(body.data);
      } catch {
        return res
          .status(400)
          .json({ message: "Invalid JSON in 'data' field" });
      }
    }

    const parsed = createPostSchema.parse({
      ...body,
      // booleans may arrive as strings when multipart/form-data
      isFeatured:
        typeof body.isFeatured === "string"
          ? body.isFeatured === "true"
          : body.isFeatured,
    });

    const cleanContent = CLEAN(parsed.content);

    // optional thumbnail upload
    let thumbnailUrl: string | undefined;
    if (req.file?.buffer) {
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        `${Date.now()}`
      );
      thumbnailUrl = uploaded?.secure_url;
    }

    // Generate a slug from the title
    const slug = parsed.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const created = await PostService.create({
      title: parsed.title,
      slug,
      content: cleanContent,
      thumbnail: thumbnailUrl,
      isFeatured: parsed.isFeatured ?? false,
      tags: parsed.tags,
      views: 0,
      author: { connect: { id: req.user?.userId } },
    });

    return res.status(201).json({ data: created });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res
        .status(422)
        .json({ message: "Validation failed", errors: err.errors });
    }
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await PostQuery.getAll();
    return res.json({ data: posts });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    const post = await PostQuery.getBySlug(slug);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json({ data: post });
  } catch (error: any) {
    console.error("Get post by slug error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id))
      return res.status(400).json({ message: "Invalid id" });

    const existing = await PostQuery.getById(id);
    if (!existing) return res.status(404).json({ message: "Post not found" });

    let body: any = req.body;
    if (typeof body.data === "string") {
      try {
        body = JSON.parse(body.data);
      } catch {
        return res
          .status(400)
          .json({ message: "Invalid JSON in 'data' field" });
      }
    }

    // Validate & sanitize
    const parsed = createPostSchema.partial().parse({
      ...body,
      isFeatured:
        typeof body.isFeatured === "string"
          ? body.isFeatured === "true"
          : body.isFeatured,
    });

    const cleanContent = parsed.content ? CLEAN(parsed.content) : undefined;

    // Handle thumbnail update if new file uploaded
    let thumbnailUrl: string | undefined;
    if (req.file?.buffer) {
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        `post-${id}`
      );
      thumbnailUrl = uploaded?.secure_url;
    }

    // Generate slug if title updated
    let slug: string | undefined;
    if (parsed.title) {
      slug = parsed.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const updated = await PostMutation.update(id, {
      ...parsed,
      ...(cleanContent ? { content: cleanContent } : {}),
      ...(thumbnailUrl ? { thumbnail: thumbnailUrl } : {}),
      ...(slug ? { slug } : {}),
    });

    return res.json({ data: updated });
  } catch (err: any) {
    console.error("Update post error:", err);
    if (err?.name === "ZodError") {
      return res
        .status(422)
        .json({ message: "Validation failed", errors: err.errors });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    // Check if post exists
    const existing = await PostQuery.getById(id);
    if (!existing) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete the post
    await PostMutation.delete(id);

    return res.json({ message: "Post deleted successfully" });
  } catch (err: any) {
    console.error("Delete post error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
