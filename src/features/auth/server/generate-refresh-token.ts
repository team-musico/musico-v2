import { SignJWT } from "jose";
import { jwtSecrets } from "@/features/auth/server/jwt-secrets";

export const generateRefreshToken = async (userId: string) => {
  return new SignJWT({ id: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(jwtSecrets.refresh);
};
