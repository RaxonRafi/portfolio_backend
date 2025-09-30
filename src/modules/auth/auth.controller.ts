import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const login = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.login(req.body);
    const isProd = process.env.NODE_ENV === "production";
    res
      .cookie("token", result.token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ user: result.user });
  } catch (error: any) {
    res.status(401).json({ message: error?.message ?? "Unauthorized" });
  }
};

export const AuthController = { login };
