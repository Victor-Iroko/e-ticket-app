import {
  pgTable,
  text,
  decimal,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { events } from "./events";

export const ticketTypes = pgTable("ticket_types", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .references(() => events.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  capacity: integer("capacity").notNull(),
  groupSize: integer("group_size").default(1),
  createdAt: timestamp("created_at").notNull(),
});
