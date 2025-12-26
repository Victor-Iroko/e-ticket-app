# E-Ticket App

An event management platform built with Nuxt 4 that handles the complete event lifecycle: creation, registration, payment processing, QR-code ticket issuance, and on-site entry validation.

## Features

### For Event Organizers

- Create and manage events with custom registration forms
- Configure multiple ticket types with different prices and capacities
- View analytics dashboards (registrations, revenue, check-ins)
- Invite team members with varying permission levels
- Manage event status and deadlines

### For Attendees

- Browse public event pages and select tickets
- Complete custom registration forms
- Secure online payments via Paystack
- Receive QR-code tickets via email
- Present QR codes for entry validation

### For Staff/Validators

- Mobile-optimized scanning interface
- Real-time QR code validation
- Prevent duplicate check-ins
- View live attendance statistics

## Tech Stack

- **Framework**: Nuxt 4 with TypeScript
- **UI**: Nuxt UI + Tailwind CSS
- **Authentication**: Better Auth (email/password + Google OAuth)
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: Pinia with persisted state
- **Payment**: Paystack with platform fee splitting
- **Email**: Nodemailer with Gmail SMTP
- **QR Codes**: node-qrcode for secure ticket generation
- **Testing**: Vitest with unit and integration tests
- **Linting**: ESLint with Prettier
- **Deployment**: Vercel

## Prerequisites

- Bun 1.3.2+
- Node.js 24.11.1+
- PostgreSQL database

## Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd e-ticket-app
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables:
     - **Database**: Set up a PostgreSQL database (local or cloud) and configure `DATABASE_URL`
     - **Better Auth**: Generate a secret key for `BETTER_AUTH_SECRET`
     - **Google OAuth**: Get credentials from [Google Cloud Console](https://console.cloud.google.com/) and set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
     - **Gmail SMTP**: Set up an App Password in your Gmail account and configure `NUXT_GMAIL_USER` and `NUXT_GMAIL_PASS`
     - **Paystack**: Get API keys from [Paystack Dashboard](https://dashboard.paystack.com/) and set `NUXT_PAYSTACK_API_KEY`

4. **Database Setup**

   ```bash
   # Generate and run migrations
   bun run db:generate
   bun run db:migrate

   # Seed initial data (optional)
   bun run db:seed
   ```

## Development

### Start Development Server

```bash
bun run dev
```

### Testing

```bash
# Run all tests
bun run test

# Run unit tests only
bun run test:unit

# Run Nuxt integration tests
bun run test:nuxt

# Run tests in watch mode
bun run test:watch

# Run tests related to changed files
bun run test:related
```

### Linting and Formatting

```bash
# Lint code
bun run lint

# Lint and auto-fix
bun run lint:fix

# Format code
bun run format
```

### Database Commands

```bash
# Generate migrations
bun run db:generate

# Run migrations
bun run db:migrate

# Open Drizzle Studio
bun run db:studio
```

## Production

### Build for Production

```bash
bun run build
```

### Preview Production Build

```bash
bun run preview
```

### Generate Static Site

```bash
bun run generate
```

## Deployment

This app is configured for deployment on Vercel. The deployment process will automatically build and deploy your application.

## Project Structure

```
app/
├── assets/css/          # Global styles
├── middleware/          # Route middleware
├── pages/              # Route components
├── plugins/            # Nuxt plugins
├── stores/             # Pinia stores
├── utils/              # Client utilities

server/
├── api/                # API routes
├── database/           # Schema and migrations
├── plugins/            # Server plugins
├── utils/              # Server utilities

shared/
└── utils/              # Shared utilities
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.
