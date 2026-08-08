import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

function isAuthorized(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key") || req.headers.get("x-admin-key");
  return key === (process.env.ADMIN_KEY ?? "admin123");
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const competition = req.nextUrl.searchParams.get("competition");

  try {
    const rows =
      competition && competition !== "All"
        ? await sql`
            SELECT id, name, email, phone, roll_number, department, year, competition, time_slot,
                   to_char(created_at AT TIME ZONE 'Asia/Kolkata', 'DD Mon YYYY HH12:MI AM') AS registered_at
            FROM registrations
            WHERE competition = ${competition}
            ORDER BY created_at DESC
          `
        : await sql`
            SELECT id, name, email, phone, roll_number, department, year, competition, time_slot,
                   to_char(created_at AT TIME ZONE 'Asia/Kolkata', 'DD Mon YYYY HH12:MI AM') AS registered_at
            FROM registrations
            ORDER BY competition, created_at DESC
          `;

    return NextResponse.json({ rows });
  } catch (err) {
    console.error("Admin export error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
