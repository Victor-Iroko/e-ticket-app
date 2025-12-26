import { pgTable, text, decimal, timestamp } from "drizzle-orm/pg-core";
import { events } from "./events";
import { ticketTypes } from "./ticket-types";
import { paymentStatusEnum } from "./enums";

export const bookings = pgTable("bookings", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .references(() => events.id)
    .notNull(),
  ticketTypeId: text("ticket_type_id")
    .references(() => ticketTypes.id)
    .notNull(),
  purchaserEmail: text("purchaser_email").notNull(),
  amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("pending"),
  paymentRef: text("payment_ref"),
  createdAt: timestamp("created_at").notNull(),
});
