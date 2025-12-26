import { pgTable, text } from "drizzle-orm/pg-core";
import { attendees } from "./attendees";
import { formFields } from "./form-fields";

export const formResponses = pgTable("form_responses", {
  id: text("id").primaryKey(),
  attendeeId: text("attendee_id")
    .references(() => attendees.id)
    .notNull(),
  formFieldId: text("form_field_id")
    .references(() => formFields.id)
    .notNull(),
  responseValue: text("response_value").notNull(),
});
