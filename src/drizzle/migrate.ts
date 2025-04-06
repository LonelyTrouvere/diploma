import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { client } from "@/drizzle/db";

dotenv.config({ path: '.env.local' })
async function main() {
  await migrate(drizzle(client), {
    migrationsFolder: "./src/drizzle/migrations",
  });

  await client.end();
}

main();
