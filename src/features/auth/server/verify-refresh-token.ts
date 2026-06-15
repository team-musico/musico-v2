import { jwtVerify } from "jose";
import { jwtSecrets } from "@/features/auth/server/jwt-secrets";

export const verifyRefreshToken = async (token: string) => {
  const { payload } = await jwtVerify(token, jwtSecrets.refresh);

  return String(payload.id);
};
