import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

const { JWT_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } = process.env;

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
  expiresIn?: string | number
): string => {
  const tokenExpiry = expiresIn || JWT_EXPIRES_IN || "2h";
  return jwt.sign(payload, JWT_SECRET, { expiresIn: tokenExpiry } as SignOptions);
};

const generateAccessToken = (payload: TokenPayload): string => {
  return generateToken(payload, JWT_EXPIRES_IN || "2h");
};

const generateRefreshToken = (payload: TokenPayload): string => {
  return generateToken(payload, REFRESH_TOKEN_EXPIRES_IN || "7d");
};

const verifyToken = (token: string): { payload: JwtPayload | string | null; error: Error | null } => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return { payload, error: null };
  } catch (error) {
    return { payload: null, error: error as Error };
  }
};

export default { 
  generateToken, 
  generateAccessToken,
  generateRefreshToken,
  verifyToken 
};