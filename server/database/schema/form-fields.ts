import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { events } from "./events";

export const formFields = pgTable("form_fields", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .references(() => events.id)
    .notNull(),
  fieldType: text("field_type").notNull(), // 'text', 'number', 'select', 'checkbox'
  label: text("label").notNull(),
  isRequired: boolean("is_required").default(false),
  options: text("options"), // JSON string for select options
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").notNull(),
});
