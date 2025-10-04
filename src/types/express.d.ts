// src/types/express.d.ts
import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      [x: string]: number | undefined; id: number; email?: string; role?: string 
};
  }
}
