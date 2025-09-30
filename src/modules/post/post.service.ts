import { Post, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

const createPost = async (payload: Prisma.PostCreateInput): Promise<Post> => {
  const result = await prisma.post.create({
    data: payload,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

export const PostService = {
  createPost,
};

const getPosts = async (): Promise<Post[]> => {
  const result = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });
  return result;
};

const getPostById = async (id: number): Promise<Post | null> => {
  const result = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, email: true } },
    },
  });
  return result;
};

const updatePost = async (
  id: number,
  payload: Prisma.PostUpdateInput
): Promise<Post> => {
  const result = await prisma.post.update({
    where: { id },
    data: payload,
    include: {
      author: { select: { id: true, name: true, email: true } },
    },
  });
  return result;
};

const deletePost = async (id: number): Promise<Post> => {
  const result = await prisma.post.delete({ where: { id } });
  return result;
};

export const PostQuery = {
  getPosts,
  getPostById,
};

export const PostMutation = {
  updatePost,
  deletePost,
};
