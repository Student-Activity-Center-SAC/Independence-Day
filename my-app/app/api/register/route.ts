import { NextRequest, NextResponse } from "next/server";
import sql, { ensureTable } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, roll_number, department, year, competition } = body;

    if (!name || !email || !phone || !roll_number || !department || !year || !competition) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await ensureTable();

    await sql`
      INSERT INTO registrations (name, email, phone, roll_number, department, year, competition)
      VALUES (${name}, ${email}, ${phone}, ${roll_number}, ${department}, ${year}, ${competition})
    `;

    return NextResponse.json({ success: true, message: "Registration successful" }, { status: 201 });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await ensureTable();
    const rows = await sql`SELECT id, name, email, department, year, competition, created_at FROM registrations ORDER BY created_at DESC`;
    return NextResponse.json({ registrations: rows });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
