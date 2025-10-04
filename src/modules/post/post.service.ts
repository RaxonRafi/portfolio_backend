import { Post, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

export const PostService = {
  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return prisma.post.create({
      data,
      include: { author: { select: { id: true, name: true, email: true } } },
    });
  },
};

export const PostQuery = {
  async getAll(): Promise<Post[]> {
    return prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });
  },
  async getBySlug(slug: string): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });
  },
  async getById(id: number): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });
  },
};

export const PostMutation = {
  async update(id: number, data: Prisma.PostUpdateInput): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data,
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async delete(id: number): Promise<Post> {
    return prisma.post.delete({
      where: { id },
    });
  },
};
