import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "../database/schema";

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
  logger: true,
  casing: "snake_case",
});
