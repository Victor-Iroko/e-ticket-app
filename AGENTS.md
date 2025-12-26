# AGENTS.md - E-Ticket App Development Guide

This document provides comprehensive guidelines for agentic coding assistants working on the E-Ticket App, an event management platform built with Nuxt 4 that handles the complete event lifecycle: creation, registration, payment processing, QR-code ticket issuance, and on-site entry validation.

## Project Overview

- **Framework**: Nuxt 4 with TypeScript
- **Authentication**: Better Auth with email/password and Google OAuth
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: Pinia with persisted state
- **UI**: Nuxt UI + Tailwind CSS
- **Testing**: Vitest with unit and Nuxt integration tests
- **Linting**: ESLint with Nuxt configuration
- **Formatting**: Prettier with Tailwind CSS plugin
- **Payment**: Paystack with platform fee splitting
- **Email**: Nodemailer for QR ticket delivery
- **QR Codes**: node-qrcode for secure ticket generation
- **Scheduling**: Server-side cron jobs for deadline enforcement

### User Types & Features

- **Event Organizers**: Create and manage events, configure custom registration questions, define ticket categories & prices, view analytics (registrations, revenue, check-ins), manage staff
- **Attendees**: Register and pay for tickets, receive QR-code tickets via email, present QR at event entrance
- **Validators/Staff**: Login only to scan and validate tickets at the event entrance

### Core Business Logic

- Event creation wizard (title, description, date, location, banner, deadline)
- Custom form builder for registration questions
- Payment processing with Paystack (platform fee split)
- QR code generation and secure validation
- Real-time ticket scanning with duplicate prevention
- Automated deadline enforcement
- Email delivery of QR tickets
- Analytics dashboards for organizers
- Team access management (organizers can invite staff)

### Key Concepts for Agents

- **Event Lifecycle**: Events progress through statuses (draft → live → ended → completed/cancelled)
- **Ticket Types**: Each event can have multiple ticket types with different prices, capacities, and group sizes
- **Bookings vs Attendees**: Bookings are financial transactions; attendees are actual ticket holders (1 booking can create multiple attendees)
- **QR Code Security**: Each attendee gets a unique QR code hash for secure validation
- **Payment Flow**: Paystack integration with platform fee splitting
- **Custom Forms**: Organizers can create custom registration questions with various field types
- **Real-time Scanning**: Duplicate prevention and immediate validation feedback
- **Team Permissions**: event_team table manages organizer/scanner roles per event

## Build, Lint, and Test Commands

### Development

```bash
# Start development server
bun run dev

# Start development server with database and studio
bun run dev:all

# Build for production
bun run build

# Generate static site
bun run generate

# Preview production build
bun run preview
```

### Linting and Formatting

```bash
# Lint code
bun run lint

# Lint and auto-fix
bun run lint:fix

# Format code (via lint-staged)
bun run format
```

### Testing

```bash
# Run all tests
bun run test

# Run unit tests only
bun run test:unit

# Run Nuxt integration tests only
bun run test:nuxt

# Run tests in watch mode
bun run test:watch

# Run tests related to changed files
bun run test:related

# Run a single test file
bun run test path/to/test.spec.ts

# Run tests with coverage
bun run test --coverage
```

### Database

```bash
# Start database (Docker)
bun run db:start

# Stop database
bun run db:stop

# Destroy database and volumes
bun run db:destroy

# Generate database migrations
bun run db:generate

# Run database migrations
bun run db:migrate

# Seed database
bun run db:seed

# Open Drizzle Studio
bun run db:studio
```

## Code Style Guidelines

### TypeScript and JavaScript

#### Imports

```typescript
// Group imports by source type
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { User } from "~/server/database/schema";

// External libraries first
import { betterAuth } from "better-auth";

// Then internal imports
import { db } from "~/server/utils/db";
import { authClient } from "~/app/utils/auth-client";

// Type-only imports
import type { Session } from "better-auth";
```

#### Naming Conventions

- **Components**: PascalCase (e.g., `LoginForm.vue`, `UserProfile.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useAuthStore`, `useUserData`)
- **Stores**: camelCase with `use` prefix (e.g., `useAuthStore`, `useTicketStore`)
- **Types**: PascalCase (e.g., `User`, `TicketStatus`)
- **Files**: kebab-case for Vue files, camelCase for TS files
- **Database tables**: snake_case (e.g., `user`, `user_session`)
- **Database columns**: camelCase (e.g., `createdAt`, `emailVerified`)

#### TypeScript Types

```typescript
// Use explicit types for complex objects
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Use utility types from Vue
const user = ref<User | null>(null);

// Prefer interface over type for object definitions
interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
}

// Use enum for fixed sets of values
enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  CLOSED = "closed",
}
```

#### Error Handling

```typescript
// Use try/catch for async operations
async function fetchUser(id: string) {
  try {
    const user = await db.query.user.findFirst({
      where: eq(user.id, id),
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
}

// Use Nuxt error handling in API routes
export default defineEventHandler(async (event) => {
  try {
    // API logic
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
```

### Vue Components

#### Composition API

```vue
<script setup lang="ts">
import { ref, computed } from "vue";

// Define props with types
interface Props {
  user: User;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

// Define emits
const emit = defineEmits<{
  update: [user: User];
  delete: [userId: string];
}>();

// Reactive data
const isEditing = ref(false);

// Computed properties
const displayName = computed(() => props.user.name || props.user.email);

// Methods
function handleSave() {
  emit("update", props.user);
  isEditing.value = false;
}
</script>
```

#### Template Structure

```vue
<template>
  <div class="user-profile">
    <UCard>
      <template #header>
        <h3>{{ displayName }}</h3>
      </template>

      <div v-if="isEditing" class="space-y-4">
        <UFormGroup label="Name">
          <UInput v-model="user.name" placeholder="Enter name" />
        </UFormGroup>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <UButton v-if="!isEditing" @click="isEditing = true"> Edit </UButton>
          <UButton v-else variant="primary" @click="handleSave"> Save </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
```

### Pinia Stores

#### Store Structure

```typescript
export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null);
  const loading = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!user.value);

  // Actions
  async function login(credentials: LoginCredentials) {
    loading.value = true;
    try {
      const result = await authClient.signIn.email(credentials);
      user.value = result.data?.user ?? null;
      return result;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    await authClient.signOut();
    user.value = null;
  }

  return {
    // State
    user,
    loading,

    // Getters
    isAuthenticated,

    // Actions
    login,
    logout,
  };
});
```

### Database Schema

#### Drizzle ORM Patterns

```typescript
// Core tables from plan.md
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

// Enums
export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "live",
  "ended",
  "cancelled",
  "completed",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "expired",
]);

// Relations
export const eventRelations = relations(events, ({ one, many }) => ({
  creator: one(user, { fields: [events.createdBy], references: [user.id] }),
  ticketTypes: many(ticketTypes),
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
```

### API Routes

#### Server API Structure

```typescript
// server/api/events/index.get.ts - Get user's events
export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession(event);
  if (!session)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const events = await db.query.events.findMany({
    where: eq(events.createdBy, session.user.id),
    with: { ticketTypes: true, bookings: true },
  });

  return events;
});

// server/api/events/[id]/public.get.ts - Public event data for registration
export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  const eventData = await db.query.events.findFirst({
    where: eq(events.id, id),
    with: {
      ticketTypes: true,
      formFields: true,
    },
  });

  if (!eventData?.isPublished) {
    throw createError({ statusCode: 404, statusMessage: "Event not found" });
  }

  return eventData;
});

// server/api/checkout.post.ts - Create booking and payment
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  // Validate input with Zod schema
  const validated = checkoutSchema.parse(body);

  const booking = await db.transaction(async (tx) => {
    // Create booking record
    const booking = await tx
      .insert(bookings)
      .values({
        eventId: validated.eventId,
        ticketTypeId: validated.ticketTypeId,
        purchaserEmail: validated.email,
        amountPaid: validated.amount,
        paymentStatus: "pending",
      })
      .returning();

    // Create attendee records with QR codes
    for (const attendee of validated.attendees) {
      const qrHash = crypto.randomUUID();
      await tx.insert(attendees).values({
        bookingId: booking[0].id,
        qrCodeHash: qrHash,
        // ... other attendee data
      });
    }

    return booking[0];
  });

  return { bookingId: booking.id, paymentUrl: paystackPaymentUrl };
});

// server/api/tickets/scan.post.ts - QR code validation
export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession(event);
  if (!session) throw createError({ statusCode: 401 });

  const { eventId, qrHash } = await readBody(event);

  const attendee = await db.query.attendees.findFirst({
    where: and(
      eq(attendees.qrCodeHash, qrHash),
      eq(attendees.checkInStatus, false),
    ),
    with: { booking: { with: { event: true } } },
  });

  if (!attendee || attendee.booking.eventId !== eventId) {
    return { status: "invalid", message: "Invalid QR code" };
  }

  if (attendee.checkInStatus) {
    return { status: "duplicate", message: "Already checked in" };
  }

  // Mark as checked in
  await db
    .update(attendees)
    .set({
      checkInStatus: true,
      checkInTime: new Date(),
      checkedInBy: session.user.id,
    })
    .where(eq(attendees.id, attendee.id));

  return {
    status: "valid",
    attendee: {
      name: attendee.name,
      ticketType: attendee.booking.ticketType.name,
    },
  };
});
```

### Testing

#### Unit Tests

```typescript
// test/unit/utils/formatters.spec.ts
import { describe, it, expect } from "vitest";
import { formatDate, formatCurrency } from "~/utils/formatters";

describe("formatters", () => {
  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2024-01-01");
      expect(formatDate(date)).toBe("Jan 1, 2024");
    });
  });

  describe("formatCurrency", () => {
    it("should format currency correctly", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
    });
  });
});
```

#### Nuxt Integration Tests

```typescript
// test/nuxt/pages/login.spec.ts
import { describe, it, expect } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils";

describe("login page", () => {
  await setup();

  it("should render login form", async () => {
    const html = await $fetch("/login");
    expect(html).toContain("Login");
  });
});
```

### Styling

#### Tailwind CSS Classes

```vue
<template>
  <!-- Use semantic class names -->
  <div class="login-container">
    <UCard class="mx-auto max-w-md">
      <form class="space-y-4">
        <UFormGroup label="Email">
          <UInput
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="w-full"
          />
        </UFormGroup>

        <UFormGroup label="Password">
          <UInput
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full"
          />
        </UFormGroup>

        <UButton
          type="submit"
          variant="primary"
          class="w-full"
          :loading="loading"
        >
          Sign In
        </UButton>
      </form>
    </UCard>
  </div>
</template>
```

### Git and Commit Conventions

#### Commit Messages

Follow conventional commits:

```
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
style: format code with prettier
refactor: simplify ticket creation logic
test: add unit tests for formatters
chore: update dependencies
```

#### Pre-commit Hooks

- **lint-staged**: Runs linting, formatting, and related tests on staged files
- **commitlint**: Validates commit message format

### Security Best Practices

- Never log sensitive data (passwords, tokens, keys)
- Use environment variables for secrets
- Validate all user inputs with Zod schemas
- Implement proper error handling without exposing internal details
- Use HTTPS in production
- Implement CSRF protection (enabled via nuxt-security)

### File Organization

```
app/
├── assets/css/          # Global styles
├── components/          # Reusable components
├── layouts/            # Page layouts
├── pages/              # Route components
├── plugins/            # Nuxt plugins
├── stores/             # Pinia stores
├── utils/              # Client utilities
└── middleware/         # Route middleware

server/
├── api/                # API routes
├── database/           # Schema and migrations
├── plugins/            # Server plugins
├── types/              # Server types
└── utils/              # Server utilities

shared/
└── utils/              # Shared utilities

test/
├── unit/               # Unit tests
├── nuxt/               # Integration tests
└── e2e/                # End-to-end tests
```

### Performance Considerations

- Use lazy loading for components: `const Component = defineAsyncComponent(() => import('~/components/HeavyComponent.vue'))`
- Implement proper loading states
- Use computed properties for expensive calculations
- Optimize images with @nuxt/image
- Implement proper caching strategies

### Development Workflow

1. Create a feature branch from `main`
2. Make changes following the code style guidelines
3. Run tests: `bun run test:related`
4. Commit with conventional commit messages
5. Push and create pull request
6. Ensure CI passes (lint, test, build)
