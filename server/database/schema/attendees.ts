import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { bookings } from "./bookings";
import { user } from "./auth-schema";

export const attendees = pgTable("attendees", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id")
    .references(() => bookings.id)
    .notNull(),
  qrCodeHash: text("qr_code_hash").unique().notNull(),
  checkInStatus: boolean("check_in_status").default(false),
  checkInTime: timestamp("check_in_time"),
  checkedInBy: text("checked_in_by").references(() => user.id),
});
