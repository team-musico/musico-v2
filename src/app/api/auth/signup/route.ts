import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin } from "@/lib/server/supabase-admin";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    username?: string;
    password?: string;
  } | null;
  const username = body?.username?.trim();
  const password = body?.password;

  if (!username || !password) {
    return NextResponse.json({ message: "BAD_REQUEST" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase
    .from("musico_users")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ message: "USER_ALREADY_EXIST" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const { error } = await supabase.from("musico_users").insert({
    username,
    password_hash: passwordHash,
  });

  if (error) {
    return NextResponse.json({ message: "SERVER_ERROR" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "USER_CREATED_SUCCESSFULLY" },
    { status: 201 },
  );
}
