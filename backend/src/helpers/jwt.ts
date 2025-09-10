import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export interface TokenPayload {
  id: number;
  email: string;
  name?: string;
}

const generateToken = (
  payload: TokenPayload,
  expiresIn: string | number = JWT_EXPIRES_IN || "1h"
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as SignOptions);
};

const verifyToken = (token: string): { payload: JwtPayload | string | null; error: Error | null } => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return { payload, error: null };
  } catch (error) {
    return { payload: null, error: error as Error };
  }
};

export default { generateToken, verifyToken };
