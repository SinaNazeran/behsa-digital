import { migrate } from "drizzle-orm/postgres-js/migrator";
import { connect } from "./_db";

const { client, db } = connect();
await migrate(db, { migrationsFolder: "./drizzle" });
console.log("✔ migrations applied");
await client.end();
