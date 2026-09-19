import "server-only";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type DB = PostgresJsDatabase<typeof schema>;

/* One pooled client per process, created lazily on first query so that
   `next build` never needs a database. Pinned on globalThis in dev to
   survive HMR without leaking connections. */
const g = globalThis as unknown as { __behsaDb?: DB };

function getDb(): DB {
  if (g.__behsaDb) return g.__behsaDb;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set — see .env.example");
  const client = postgres(url, { max: Number(process.env.DATABASE_POOL_MAX ?? 10) });
  g.__behsaDb = drizzle(client, { schema });
  return g.__behsaDb;
}

export const db = new Proxy({} as DB, {
  get(_t, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export { schema };
