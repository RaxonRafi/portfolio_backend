import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const login = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.login(req.body);
    res
      .cookie("token", result.token, {
        httpOnly: true,
        secure: true,
        sameSite:"none",

      })
      .json({ user: result.user, token:result.token });
  } catch (error: any) {
    res.status(401).json({ message: error?.message ?? "Unauthorized" });
  }
};

export const AuthController = { login };
