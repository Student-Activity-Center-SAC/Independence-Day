import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// Simple password guard via Authorization header or ?key= query param
function isAuthorized(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key") || req.headers.get("x-admin-key");
  return key === (process.env.ADMIN_KEY ?? "admin123");
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      totalRows,
      byCompetition,
      byDepartment,
      byYear,
      recent,
      byDate,
    ] = await Promise.all([
      // Total count
      sql`SELECT COUNT(*)::int AS total FROM registrations`,

      // Per competition
      sql`
        SELECT competition, COUNT(*)::int AS count
        FROM registrations
        GROUP BY competition
        ORDER BY count DESC
      `,

      // Per department
      sql`
        SELECT department, COUNT(*)::int AS count
        FROM registrations
        GROUP BY department
        ORDER BY count DESC
      `,

      // Per year of study
      sql`
        SELECT year, COUNT(*)::int AS count
        FROM registrations
        GROUP BY year
        ORDER BY year
      `,

      // Recent 50 registrations
      sql`
        SELECT id, name, email, phone, roll_number, department, year, competition,
               to_char(created_at AT TIME ZONE 'Asia/Kolkata', 'DD Mon YYYY HH12:MI AM') AS registered_at
        FROM registrations
        ORDER BY created_at DESC
        LIMIT 50
      `,

      // Registrations per day (last 7 days)
      sql`
        SELECT to_char(created_at AT TIME ZONE 'Asia/Kolkata', 'DD Mon') AS day,
               COUNT(*)::int AS count
        FROM registrations
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP BY day, DATE_TRUNC('day', created_at AT TIME ZONE 'Asia/Kolkata')
        ORDER BY DATE_TRUNC('day', created_at AT TIME ZONE 'Asia/Kolkata')
      `,
    ]);

    return NextResponse.json({
      total: totalRows[0]?.total ?? 0,
      byCompetition,
      byDepartment,
      byYear,
      recent,
      byDate,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
