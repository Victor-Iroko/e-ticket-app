import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { eventStatusEnum } from "./enums";
import { user } from "./auth-schema";

export const events = pgTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  bannerUrl: text("banner_url"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  registrationDeadline: timestamp("registration_deadline").notNull(),
  isPublished: boolean("is_published").default(false),
  status: eventStatusEnum("status").default("draft"),
  createdAt: timestamp("created_at").notNull(),
  createdBy: text("created_by")
    .references(() => user.id)
    .notNull(),
  slug: text("slug"),
});
