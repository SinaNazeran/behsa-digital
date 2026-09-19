import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";

export function connect() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("✖ DATABASE_URL is not set (copy .env.example to .env)");
    process.exit(1);
  }
  const client = postgres(url, { max: 1, onnotice: () => {} });
  return { client, db: drizzle(client, { schema }), schema };
}
