import * as crypto from "node:crypto";
import * as jwt from "jsonwebtoken";
import env from "../config/env.js";

interface DecodedToken extends jwt.JwtPayload {
  id: string;
  role?: "user" | "admin";
}

type TokenPayload = { id: string; role?: "user" | "admin" };

export const signToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.jwtSecret as jwt.Secret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] });

export const signRefreshToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.refreshTokenSecret as jwt.Secret, {
    expiresIn: env.refreshTokenExpiresIn as jwt.SignOptions["expiresIn"],
  });

export const verifyToken = (token: string) => jwt.verify(token, env.jwtSecret) as DecodedToken;
export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.refreshTokenSecret) as DecodedToken;

export const generateResetToken = () => crypto.randomBytes(32).toString("hex");
export const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");
