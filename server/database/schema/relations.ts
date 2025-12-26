import { relations } from "drizzle-orm";
import { user, session, account } from "./auth-schema";
import { events } from "./events";
import { ticketTypes } from "./ticket-types";
import { bookings } from "./bookings";
import { attendees } from "./attendees";
import { eventTeam } from "./event-team";
import { formFields } from "./form-fields";
import { formResponses } from "./form-responses";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  events: many(events),
  eventTeam: many(eventTeam),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const eventRelations = relations(events, ({ one, many }) => ({
  creator: one(user, { fields: [events.createdBy], references: [user.id] }),
  ticketTypes: many(ticketTypes),
  bookings: many(bookings),
  eventTeam: many(eventTeam),
  formFields: many(formFields),
}));

export const ticketTypeRelations = relations(ticketTypes, ({ one, many }) => ({
  event: one(events, {
    fields: [ticketTypes.eventId],
    references: [events.id],
  }),
  bookings: many(bookings),
}));

export const bookingRelations = relations(bookings, ({ one, many }) => ({
  event: one(events, { fields: [bookings.eventId], references: [events.id] }),
  ticketType: one(ticketTypes, {
    fields: [bookings.ticketTypeId],
    references: [ticketTypes.id],
  }),
  attendees: many(attendees),
}));

export const attendeeRelations = relations(attendees, ({ one, many }) => ({
  booking: one(bookings, {
    fields: [attendees.bookingId],
    references: [bookings.id],
  }),
  checkedInByUser: one(user, {
    fields: [attendees.checkedInBy],
    references: [user.id],
  }),
  formResponses: many(formResponses),
}));

export const eventTeamRelations = relations(eventTeam, ({ one }) => ({
  event: one(events, { fields: [eventTeam.eventId], references: [events.id] }),
  user: one(user, { fields: [eventTeam.userId], references: [user.id] }),
}));

export const formFieldRelations = relations(formFields, ({ one, many }) => ({
  event: one(events, { fields: [formFields.eventId], references: [events.id] }),
  formResponses: many(formResponses),
}));

export const formResponseRelations = relations(formResponses, ({ one }) => ({
  attendee: one(attendees, {
    fields: [formResponses.attendeeId],
    references: [attendees.id],
  }),
  formField: one(formFields, {
    fields: [formResponses.formFieldId],
    references: [formFields.id],
  }),
}));
