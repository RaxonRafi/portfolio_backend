-- CreateTable
CREATE TABLE "public"."Project" (
    "id" SERIAL NOT NULL,
    "project_title" TEXT NOT NULL,
    "tech_used" TEXT[],
    "desc" TEXT NOT NULL,
    "key_features" TEXT[],
    "git_url" TEXT,
    "live_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
