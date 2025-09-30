import { Prisma, Project } from "@prisma/client";
import { prisma } from "../../config/db";


const createProject = async (
  payload: Prisma.ProjectCreateInput
): Promise<Project> => {
  const result = await prisma.project.create({ data: payload });
  return result;
};

const getProjects = async (): Promise<Project[]> => {
  const result = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const getProjectById = async (id: number): Promise<Project | null> => {
  const result = await prisma.project.findUnique({ where: { id } });
  return result;
};

const updateProject = async (
  id: number,
  payload: Prisma.ProjectUpdateInput
): Promise<Project> => {
  const result = await prisma.project.update({ where: { id }, data: payload });
  return result;
};

const deleteProject = async (id: number): Promise<Project> => {
  const result = await prisma.project.delete({ where: { id } });
  return result;
};

export const ProjectService = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
