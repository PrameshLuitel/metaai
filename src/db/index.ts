import "dotenv/config";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

let db: NeonHttpDatabase<typeof schema> | null = null;

if (process.env.DATABASE_URL) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema });
  } catch (e) {
    console.error('Failed to connect to the database:', e);
  }
} else {
  console.warn("DATABASE_URL environment variable is not set. Database queries will be disabled.");
}

export { db };
