
import { z } from "zod";

const tagsPreprocessor = z.preprocess((val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    return val.split(",").map(s => s.trim()).filter(Boolean);
  }
  return [];
}, z.array(z.string()).default([]));

export const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(1),         // rich HTML
  isFeatured: z.preprocess(v => (typeof v === "string" ? v === "true" : v), z.boolean().default(false)),
  tags: tagsPreprocessor,
});
export type CreatePostDTO = z.infer<typeof createPostSchema>;
