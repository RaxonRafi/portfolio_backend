import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { authRouter } from "./modules/auth/auth.router";
import { postRouter } from "./modules/post/post.router";
import { projectRouter } from "./modules/project/project.router";
import { userRouter } from "./modules/user/user.routes";

const app = express();

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(compression()); // Compresses response bodies for faster delivery
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/auth", authRouter);

// Default route for testing
app.get("/", (_req, res) => {
  res.send("API is running");
});

// Supabase health check (Auth service)
app.get("/api/v1/health/supabase", async (_req, res) => {
  try {
    const url = `${process.env.SUPABASE_URL}/auth/v1/health`;
    const apikey = process.env.SUPABASE_ANON_KEY ?? "";
    const response = await fetch(url, {
      headers: {
        apikey,
        Authorization: `Bearer ${apikey}`,
      },
    });
    if (!response.ok) {
      const text = await response.text();
      return res
        .status(500)
        .json({ ok: false, status: response.status, body: text });
    }
    return res.json({ ok: true });
  } catch (err: any) {
    return res
      .status(500)
      .json({ ok: false, error: err?.message ?? "Unknown error" });
  }
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
