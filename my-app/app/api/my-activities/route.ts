import { NextResponse } from "next/server";
import { auth } from "@/auth";
import sql, { ensureTable, ensureUsersTable } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await ensureTable();
  await ensureUsersTable();

  const [registrations, profile] = await Promise.all([
    sql`SELECT * FROM registrations WHERE email = ${session.user.email} ORDER BY created_at DESC`,
    sql`SELECT * FROM users WHERE email = ${session.user.email} LIMIT 1`,
  ]);

  return NextResponse.json({
    registrations,
    profile: profile[0] ?? null,
  });
}
