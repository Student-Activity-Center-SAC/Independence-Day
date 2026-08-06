import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
export default sql;

export async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS registrations (
      id            SERIAL PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL,
      phone         TEXT NOT NULL,
      department    TEXT NOT NULL,
      year          TEXT NOT NULL,
      roll_number   TEXT NOT NULL,
      competition   TEXT NOT NULL,
      gender        TEXT,
      accommodation TEXT,
      time_slot     TEXT,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  // Add columns that may be missing on existing tables
  await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS gender TEXT`;
  await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS accommodation TEXT`;
  await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS time_slot TEXT`;
  // Remove duplicate registrations, keeping only the latest per email+competition
  await sql`
    DELETE FROM registrations
    WHERE id NOT IN (
      SELECT MAX(id) FROM registrations GROUP BY email, competition
    )
  `;
  // Enforce uniqueness at DB level
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_email_competition
    ON registrations (email, competition)
  `;
}

export async function ensureUsersTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id               SERIAL PRIMARY KEY,
      email            TEXT UNIQUE NOT NULL,
      name             TEXT NOT NULL,
      microsoft_id     TEXT,
      id_number        TEXT,
      phone            TEXT,
      department       TEXT,
      year             TEXT,
      gender           TEXT,
      accommodation    TEXT,
      profile_complete BOOLEAN DEFAULT FALSE,
      created_at       TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}
