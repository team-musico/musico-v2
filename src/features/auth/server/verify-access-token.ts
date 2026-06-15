import { jwtVerify } from "jose";
import { jwtSecrets } from "@/features/auth/server/jwt-secrets";

export const verifyAccessToken = async (token: string) => {
  const { payload } = await jwtVerify(token, jwtSecrets.access);

  return String(payload.id);
};
