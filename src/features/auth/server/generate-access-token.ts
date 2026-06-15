import { SignJWT } from "jose";
import { jwtSecrets } from "@/features/auth/server/jwt-secrets";

export const generateAccessToken = async (userId: string) => {
  return new SignJWT({ id: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(jwtSecrets.access);
};
