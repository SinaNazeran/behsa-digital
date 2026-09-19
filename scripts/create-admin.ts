/* Create (or reset the password of) an admin user.
   Usage: ADMIN_EMAIL=… ADMIN_PASSWORD=… npm run admin:create */
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { connect } from "./_db";

const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? "";
const name = process.env.ADMIN_NAME ?? "مدیر سایت";

if (!email || password.length < 10) {
  console.error("✖ set ADMIN_EMAIL and ADMIN_PASSWORD (min 10 chars)");
  process.exit(1);
}

const { client, db, schema } = connect();
const passwordHash = await bcrypt.hash(password, 12);
const existing = await db.select().from(schema.adminUsers).where(sql`lower(${schema.adminUsers.email}) = ${email}`);

if (existing.length) {
  await db.update(schema.adminUsers).set({ passwordHash, isActive: true, role: "admin" }).where(sql`id = ${existing[0].id}`);
  await db.delete(schema.sessions).where(sql`user_id = ${existing[0].id}`);
  console.log(`✔ password reset for ${email}`);
} else {
  await db.insert(schema.adminUsers).values({ email, name, passwordHash, role: "admin" });
  console.log(`✔ admin created: ${email}`);
}
await client.end();
