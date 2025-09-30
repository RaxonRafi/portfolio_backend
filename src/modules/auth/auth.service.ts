import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { prisma } from "../../config/db";

type LoginInput = {
  email: string;
  password: string;
};

const login = async (payload: LoginInput) => {
  const user = await prisma.user.findFirst({
    where: { email: payload.email },
  });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // NOTE: Plain text compare for now because users aren't hashed in schema.
  // Replace with bcrypt.compare if you add hashing.
  if (user.password && user.password !== payload.password) {
    throw new Error("Invalid credentials");
  }

  const secret: Secret = (process.env.JWT_SECRET as string) || "";
  // Use seconds to satisfy the stricter SignOptions typing
  const expiresInSeconds = Number(process.env.JWT_EXPIRES_IN) || 86400; // 1 day
  const options: SignOptions = {
    expiresIn: expiresInSeconds,
  };
  const token = jwt.sign({ userId: user.id, role: user.role }, secret, options);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const AuthService = { login };
