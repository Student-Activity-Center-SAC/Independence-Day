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
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  // Add columns that may be missing on existing tables
  await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS gender TEXT`;
  await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS accommodation TEXT`;
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
