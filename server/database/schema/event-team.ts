import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { events } from "./events";
import { user } from "./auth-schema";

export const eventTeam = pgTable("event_team", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .references(() => events.id)
    .notNull(),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  role: text("role").notNull(), // 'organizer', 'scanner'
  createdAt: timestamp("created_at").notNull(),
});
