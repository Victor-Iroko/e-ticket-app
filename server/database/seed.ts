/* eslint-disable no-console */
import { reset, seed } from "drizzle-seed";
import { db } from "../utils/db";
import * as schema from "./schema";

// Define seed counts dictionary
const SEED_COUNTS = {
  users: 10,
  events: 5,
  ticketTypesPerEvent: 3,
  bookings: 50,
  attendeesPerBooking: 2,
  formFieldsPerEvent: 5,
  formResponsesPerAttendee: 3,
  eventTeamPerEvent: 2,
};

async function main() {
  console.log("Resetting database...");
  await reset(db, schema);
  console.log("Database reset complete.");

  console.log("Seeding database...");

  await seed(db, schema, { count: 1000, seed: 123 }).refine((f) => ({
    users: {
      columns: {
        id: f.string({ isUnique: true }),
        name: f.fullName(),
        email: f.email(),
        emailVerified: f.boolean(),
        image: f.string(),
        createdAt: f.date(),
        updatedAt: f.date(),
      },
      count: SEED_COUNTS.users,
    },
    events: {
      columns: {
        id: f.string({ isUnique: true }),
        // Fix: Wrap arrays in { values: [...] }
        title: f.valuesFromArray({
          values: [
            "Tech Conference 2024",
            "Music Festival",
            "Art Exhibition",
            "Sports Tournament",
            "Business Summit",
          ],
        }),
        description: f.loremIpsum({ sentencesCount: 3 }),
        location: f.valuesFromArray({
          values: ["New York", "London", "Paris", "Tokyo", "Sydney"],
        }),
        bannerUrl: f.string(),
        startDate: f.date(),
        endDate: f.date(),
        registrationDeadline: f.date(),
        isPublished: f.boolean(),
        status: f.valuesFromArray({ values: ["draft", "live", "ended"] }),
        createdAt: f.date(),
        slug: f.string(), // Removed { length: 20 } as it is not supported
      },
      count: SEED_COUNTS.events,
    },
    ticketTypes: {
      columns: {
        id: f.string({ isUnique: true }),
        name: f.valuesFromArray({
          values: [
            "General Admission",
            "VIP",
            "Student",
            "Early Bird",
            "Group",
          ],
        }),
        description: f.loremIpsum({ sentencesCount: 1 }),
        price: f.number({ minValue: 0, maxValue: 500, precision: 0.01 }),
        capacity: f.int({ minValue: 10, maxValue: 1000 }),
        groupSize: f.int({ minValue: 1, maxValue: 10 }),
        createdAt: f.date(),
      },
      count: SEED_COUNTS.events * SEED_COUNTS.ticketTypesPerEvent,
    },
    eventTeam: {
      columns: {
        id: f.string({ isUnique: true }),
        role: f.valuesFromArray({ values: ["organizer", "scanner"] }),
        createdAt: f.date(),
      },
      count: SEED_COUNTS.events * SEED_COUNTS.eventTeamPerEvent,
    },
    formFields: {
      columns: {
        id: f.string({ isUnique: true }),
        fieldType: f.valuesFromArray({
          values: ["text", "number", "select", "checkbox"],
        }),
        label: f.string(),
        isRequired: f.boolean(),
        options: f.valuesFromArray({
          values: [
            "null", // Generator cannot accept raw null in the array sometimes, use string "null" or handle in schema default
            JSON.stringify(["option1", "option2", "option3"]),
          ],
        }),
        orderIndex: f.int({ minValue: 1, maxValue: 10 }),
        createdAt: f.date(),
      },
      count: SEED_COUNTS.events * SEED_COUNTS.formFieldsPerEvent,
    },
    bookings: {
      columns: {
        id: f.string({ isUnique: true }),
        purchaserEmail: f.email(),
        amountPaid: f.number({ minValue: 0, maxValue: 500, precision: 0.01 }),
        paymentStatus: f.valuesFromArray({
          values: ["pending", "paid", "failed"],
        }),
        paymentRef: f.string(),
        createdAt: f.date(),
      },
      count: SEED_COUNTS.bookings,
    },
    attendees: {
      columns: {
        id: f.string({ isUnique: true }),
        qrCodeHash: f.string({ isUnique: true }),
        checkInStatus: f.boolean(),
        checkInTime: f.date(),
      },
      count: SEED_COUNTS.bookings * SEED_COUNTS.attendeesPerBooking,
    },
    formResponses: {
      columns: {
        id: f.string({ isUnique: true }),
        responseValue: f.string(), // Removed length
      },
      count:
        SEED_COUNTS.bookings *
        SEED_COUNTS.attendeesPerBooking *
        SEED_COUNTS.formResponsesPerAttendee,
    },
  }));

  console.log("Seeding complete!");
}

main().catch(console.error);
