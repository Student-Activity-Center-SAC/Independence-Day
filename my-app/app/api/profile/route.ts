import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import sql, { ensureUsersTable } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await ensureUsersTable();
  const rows = await sql`SELECT * FROM users WHERE email = ${session.user.email} LIMIT 1`;
  return NextResponse.json({ user: rows[0] ?? null });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id_number, phone, department, year, gender, accommodation } = body;

  if (!id_number || !phone || !department || !year || !gender || !accommodation) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  await ensureUsersTable();

  await sql`
    INSERT INTO users (email, name, microsoft_id, id_number, phone, department, year, gender, accommodation, profile_complete)
    VALUES (
      ${session.user.email},
      ${session.user.name ?? ""},
      ${session.user.id ?? null},
      ${id_number}, ${phone}, ${department}, ${year}, ${gender}, ${accommodation}, TRUE
    )
    ON CONFLICT (email) DO UPDATE SET
      id_number        = EXCLUDED.id_number,
      phone            = EXCLUDED.phone,
      department       = EXCLUDED.department,
      year             = EXCLUDED.year,
      gender           = EXCLUDED.gender,
      accommodation    = EXCLUDED.accommodation,
      profile_complete = TRUE
  `;

  return NextResponse.json({ success: true });
}
