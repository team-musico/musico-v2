import { NextRequest, NextResponse } from "next/server";
import { getRequiredLegacyUser } from "@/features/auth/server/get-required-legacy-user";

export const getRequiredAdminUser = async (request: NextRequest) => {
  const { error, user } = await getRequiredLegacyUser(request);

  if (error || !user) {
    return { error, user: null };
  }

  if (user.role !== "admin") {
    return {
      error: NextResponse.json({ message: "ADMIN_FORBIDDEN" }, { status: 403 }),
      user: null,
    };
  }

  return { error: null, user };
};
