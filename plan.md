## 1️⃣ Requirements Planning

### Questions to Ask

- **What is the app about?**
  It is an event management platform that handles the full lifecycle of an event: creation, registration, payment processing, QR-code ticket issuance, and on-site entry validation.
- **Who are the different types of users?**
  - **Event Organizers** → Create and manage events, view registrations & revenue, manage staff.
  - **Attendees** → Register and pay for tickets, receive QR-code tickets via email.
  - **Validators / Staff** → Login only to scan and validate tickets at the event entrance.
- **What can each user type do?**
  - **Organizers**
    - Create events
    - Configure custom registration questions
    - Define ticket categories & prices
    - View analytics (registrations, revenue, check-ins)
    - Invite team members (organizers or scanners)
  - **Attendees**
    - Open a public event page
    - Select a ticket type
    - Fill registration form
    - Pay online
    - Receive **QR code after booking**
    - Present QR at event entrance
  - **Validators**
    - Login to scanning dashboard
    - Scan attendee QR codes
    - See real-time validation & check-in status
- **What is the app doing?**
  - Processing online ticket sales
  - Generating unique, secure QR codes
  - Validating QR-codes in real-time (prevent reuse)
  - Providing dashboards for revenue & attendance
  - Enforcing registration deadlines automatically

---

### List of Requirements

- **Event Creation Wizard**
  - Title, Description, Date, Location, Banner, Deadline
- **Custom Form Builder**
  - Organizer-defined fields (text, dropdown, checkbox, etc.)
- **Payment & Ticketing**
  - Multiple ticket tiers
  - QR code after booking
  - Platform fee revenue split
  - Email delivery of QR code
- **Deadline Logic**
  - Registration closes automatically at deadline
  - Status auto-changes based on rules
- **Scanning System**
  - Browser-based camera scanning
  - Real-time validity check
  - Prevent duplicate check-ins
- **Dashboards**
  - **Pre-Event:** registrations & revenue
  - **During Event:** live check-ins & counts
- **Team Access**
  - Organizers can invite additional organizers & scanners

---

## 2️⃣ Design

### A. Frontend

1. Page List (Sitemap)
   - Zone A: Public Pages (No Login Required)
     - Landing Page (Home)
       - **Content:** Hero section ("Create your event"), Features overview, Pricing, "Get Started" button.
       - **Interaction:** Click "Login" or "Sign Up".
     - Event Registration Page (`/register/:slug`)
       - **Content:**
         - Event Banner & Title.
         - Description & Map/Location.
         - **Ticket List:** Cards showing Name, Price, "Sold Out" status.
         - **Registration Form:** Dynamic fields (Name, Email, Custom Questions).
         - **Order Summary:** "Total: ₦5,000".
       - **Interactions:** Select ticket, Fill form, Click "Pay Now".
     - Payment Success / Thank You (`/register/:slug/success`)
       - **Content:** Success Message, Order Reference, **"Download Ticket" Button**.
       - **Interactions:** Download PDF.
     - Login / Sign Up (`/login`)
       - **Content:** Email/Password fields, "Forgot Password" link.
       - **Interactions:** Submit credentials, Redirect to Dashboard.
   - Zone B: Organizer Dashboard (Protected)
     - Dashboard Home (`/dashboard`)
       - **Content:** List of user's events (Card view). Each card shows: Status (Draft/Live), Date, Quick Stats.
       - **Interactions:** Click an event to manage it, Click "Create New Event".
     - Create Event Wizard (`/dashboard/events/new`)
       - **Content:** Inputs for Title, Date, Location, Image Upload.
       - **Interactions:** Save & Continue to Ticket Setup.
     - Event Overview (`/dashboard/events/:id/overview`)
       - **Content:**
         - **Big Stats Cards:** Revenue, Tickets Sold, Page Views.
         - **Quick Actions:** "Edit Event", "View Public Page".
         - **Sales Chart:** Line graph of sales over time.
       - **Interactions:** Toggle Publish/Unpublish status.
     - Ticket & Form Editor (`/dashboard/events/:id/setup`)
       - **Content:**
         - List of Ticket Types (with "Add New" button).
         - Form Builder (List of current questions, drag-and-drop area).
       - **Interactions:** Add Ticket Type, Add Question (Text/Dropdown), Save Changes.
     - Bookings & Attendees (`/dashboard/events/:id/attendees`)
       - **Content:** Two tabs.
         - **Tab 1 (Bookings):** Table of financial transactions (Email, Amount, Status, Refund Button).
         - **Tab 2 (Guest List):** Table of actual humans (Name, Ticket Type, Check-in Status).
       - **Interactions:** Search, Export to CSV, Manually check someone in.
     - Team Settings (`/dashboard/events/:id/team`)
       - **Content:** List of current staff (Scanners/Admins), "Invite Member" form.
       - **Interactions:** Input email -> Send Invite.
   - Zone C: Scanner / Staff Interface (Mobile Optimized)
     - Scanner Home (`/staff`)
       - **Content:** Simple list of events assigned to this user.
       - **Interactions:** Tap event to start scanning.
     - Scan Mode (`/staff/:id/scan`)
       - **Content:**
         - **Camera Viewfinder:** Active camera feed.
         - **Manual Input:** "Type Code" button (fallback).
         - **Stats:** "Checked In: 150/200".
       - **Interactions:** Scan QR, View Success/Error Modal, Reset for next scan.
2. User Flow
   - Flow 1: The "Organizer" Path
     _Goal: Create money-making event._
     1. **Login** → Redirects to `/dashboard`.
     2. **Dashboard** → Click **"Create Event"**.
     3. **Wizard** → Fill Details → Define Tickets (VIP/Regular) → Add Form Questions.
     4. **Publish** → Toggle "Live". System generates Public Link.
     5. **Share** → Copy link, post on Twitter/WhatsApp.
     6. **Monitor** → Refresh `/dashboard` to watch revenue graph go up.
   - Flow 2: The "Attendee" Path
     _Goal: Buy ticket and enter._
     1. **Discovery** → Click link on Twitter (`/register/tech-conf`).
     2. **Selection** → Choose "VIP Table".
     3. **Data Entry** → Fill name, email, and "Dietary Needs".
     4. **Payment** → Paystack Modal.
     5. **Success** → See "Thank You" page. Click "Download Ticket".
        - _System sends Email simultaneously._
     6. **Entry** → Arrive at venue. Show Phone.
   - Flow 3: The "Staff" Path (Scanner)
     _Goal: Validate tickets at the door._
     1. **Invite** → Receive email: "You are invited to scan at Tech Conf".
     2. **Login** → Redirects to `/dashboard`.
        - _Logic Check:_ Does this user have any "Owned" events? No.
        - _Redirect:_ Auto-switch to `/staff` view (simpler interface).
     3. **Select Event** → Tap "Tech Conf".
     4. **Scan** → Camera opens.
        - **Scenario A:** Scans valid code. App flashes **GREEN**. "Welcome, Sarah!"
        - **Scenario B:** Scans duplicate code. App flashes **RED**. "ALREADY USED at 10:05 AM".
     5. **End Shift** → Log out.
   - Flow 4: The "Hybrid" User (Complex)
     _Context: I own an event, but I am also helping my friend scan at his event._
     1. **Login** → Redirects to `/dashboard`.
     2. **View Selection:**
        - The Dashboard shows a list.
        - Item 1: "My Birthday Party" (Badge: **OWNER**) → Clicking goes to Admin Panel.
        - Item 2: "Friend's Concert" (Badge: **STAFF**) → Clicking goes to Scanner Mode.
3. Wireframes

---

### B. Backend

1. API
   - **Protocol:** REST (JSON)
   - User
     - `GET /users/me`
       Fetch profile of currently logged-in user.
     - **`GET /users/my-events`**
       Returns list of events where the user is Organizer OR Staff (scanner).
   - Events
     - **`POST /events`**
       - _Create event._
     - **`GET /events/:id/dashboard`**
       - _Protected (Organizer only)._ Returns sensitive info: `revenue`, `tickets_sold`, `check_in_count`.
     - **`GET /events/:id/public`**
       - _Public (No Auth)._ Returns: `title`, `banner`, `ticket_types`, and **`form_fields`** (so the frontend knows what questions to ask).
       - Used by the frontend to render the registration form.
       ```json
       // GET /events/123/public
       {
         "title": "Tech Summit",
         "ticket_types": [ ... ],
         "form_fields": [   // <--- Just include them here!
           { "label": "Full Name", "type": "text" },
           { "label": "Dietary Restrictions", "type": "dropdown" }
         ]
       }
       ```
     - **`PATCH /events/:id`**
       - _Update details._
     - **`POST /events/:id/team`**
       - _Input:_ `{ "email": "staff@gmail.com", "role": "scanner" }`
       - _Logic:_ Invites a user to be a scanner or organizer for this event.
   - Dynamic Forms
     - **`POST /events/:id/form-fields`**
       - Input:
       ```json
       {
         "fields": [
           { "label": "Dietary Restriction", "type": "text", "required": true },
           { "label": "Company", "type": "text" }
         ]
       }
       ```
   - Ticket Types
     - `POST /events/:id/ticket-types`
       Create.
     - `DELETE /events/:id/ticket-types/:ticketTypeId`
       Delete
   - Booking & Checkout
     - `POST /checkout`
       - Input:

       ```json
       {
         "event_id": "uuid",
         "ticket_type_id": "uuid",
         "quantity": 2, // Logic: Creates 2 Attendee rows
         "attendee_data": [
           // Array size must match quantity
           {
             "name": "Ibrahim",
             "responses": [{ "field_id": 1, "value": "Vegan" }]
           },
           {
             "name": "Sarah",
             "responses": [{ "field_id": 1, "value": "None" }]
           }
         ]
       }
       ```

       - _Output:_ `{ "payment_url": "https://paystack..." }`

     - **`GET /bookings/:reference`**
       Used for the "Thank You" page to confirm payment status.
     - `POST /webhooks/payment`

   - Tickets & Scanning
     - `GET /tickets/download/:bookingId`
       Returns the PDF with QR codes for that order.
     - `POST /tickets/scan`
       - Input:

       ```json
       {
         "event_id": "uuid",
         "qr_hash": "550e8400-e29b..." // The string from the QR code
       }
       ```

       - Output:

       ```json
       {
         "status": "valid",
         "attendee": { "name": "Sarah", "ticket_type": "VIP" }
       }
       // OR
       { "status": "duplicate", "message": "Already checked in at 10:00 AM" }
       ```

   - Data & Exports
     - `GET /events/:id/attendees`
       Returns a table of all people: Name, Email, Ticket Type, Check-in Status.
     - **`GET /events/:id/stats`**
       Returns charts data: Sales over time, Ticket Type breakdown.
     - GET /events/:id/bookings
       - **Purpose:** Lists financial transactions.
       - Returns:
       ```json
       [
         {
           "booking_id": "uuid-1",
           "purchaser_email": "ibrahim@gmail.com",
           "ticket_name": "VIP Table",
           "amount_paid": 300000,
           "payment_status": "paid",
           "payment_ref": "REF-888",
           "created_at": "2025-10-10..."
         },
         ...
       ]
       ```

2. Database Schema

- **Database Type:** SQL (relational)

🧍 Table: `users`

- Generated by better auth (We don’t have any custom fields)

🎊 Table: `events`

| **Field**                 | **Data Type** | **Constraints**                                    | **Description**                                             |
| ------------------------- | ------------- | -------------------------------------------------- | ----------------------------------------------------------- |
| **id**                    | UUID          | PK                                                 | Event ID                                                    |
| **title**                 | VARCHAR(255)  | NOT NULL                                           | Event name (e.g. "Tech Summit")                             |
| **description**           | TEXT          | NULL                                               | Full details about the event                                |
| **location**              | VARCHAR(255)  | NOT NULL                                           | Physical address or link                                    |
| **banner_url**            | VARCHAR       | NULL                                               | URL to the event cover image                                |
| **start_date**            | TIMESTAMP     | NOT NULL                                           | When the event begins                                       |
| **end_date**              | TIMESTAMP     | NULL                                               | When the event ends                                         |
| **registration_deadline** | TIMESTAMP     | NOT NULL                                           | Links close after this date                                 |
| **is_published**          | BOOLEAN       | DEFAULT FALSE                                      | If false, only staff can see it                             |
| **status**                | ENUM          | 'draft', 'live', 'ended', 'cancelled', ‘completed’ | Lifecycle state                                             |
| **created_at**            | TIMESTAMP     | DEFAULT NOW()                                      | Creation date                                               |
| created_by                | UUID          | FK → users(id), NOT NULL                           | The main creator of the event                               |
| slug                      | VARCHAR       | NULL                                               | slug used to match the registration url to a specific event |

**🤝 Table: event_team**

This solves the "One User, Multiple Roles" problem.

| **Field**      | **Data Type** | **Constraints**           | **Description**   |
| -------------- | ------------- | ------------------------- | ----------------- |
| **id**         | UUID          | PK                        | Record ID         |
| **event_id**   | UUID          | FK → events(id), NOT NULL | The event         |
| **user_id**    | UUID          | FK → users(id), NOT NULL  | The team member   |
| **role**       | ENUM          | 'admin', 'scanner'        | Permissions level |
| **created_at** | TIMESTAMP     | DEFAULT NOW()             | Date added        |

🎟 Table: ticket_types

| **Field**       | **Data Type** | **Constraints**           | **Description**                        |
| --------------- | ------------- | ------------------------- | -------------------------------------- |
| **id**          | UUID          | PK                        | Ticket Type ID                         |
| **event_id**    | UUID          | FK → events(id), NOT NULL | The event this belongs to              |
| **name**        | VARCHAR(100)  | NOT NULL                  | Label (e.g., "VIP Table")              |
| **description** | TEXT          | NULL                      | Perks included (e.g., "Free drinks")   |
| **price**       | DECIMAL(10,2) | NOT NULL                  | Cost per unit (0 for free)             |
| **capacity**    | INT           | NOT NULL                  | Total stock for this specific type     |
| **group_size**  | INT           | DEFAULT 1                 | Attendees per ticket (e.g., Table = 6) |
| **created_at**  | TIMESTAMP     | DEFAULT NOW()             | Created date                           |

📝 Table: form_fields

_This stores the "Questions" the organizer wants to ask._

| **Field**       | **Data Type** | **Constraints**                        | **Description**                                        |
| --------------- | ------------- | -------------------------------------- | ------------------------------------------------------ |
| **id**          | UUID          | PK                                     | Field ID                                               |
| **event_id**    | UUID          | FK → events(id), NOT NULL              | The event                                              |
| **label**       | VARCHAR(255)  | NOT NULL                               | The question (e.g., "Dietary Needs")                   |
| **field_type**  | ENUM          | 'text', 'number', 'select', 'checkbox' | UI input type                                          |
| **options**     | JSONB         | NULL                                   | Choices if type is 'select' (e.g. `["Vegan", "Meat"]`) |
| **is_required** | BOOLEAN       | DEFAULT FALSE                          | Must the user answer?                                  |
| **order_index** | INT           | DEFAULT 0                              | Sort order on the screen                               |

🛍 Table: bookings

Represents the financial transaction/order.

| **Field**           | **Data Type** | **Constraints**                        | **Description**                                           |
| ------------------- | ------------- | -------------------------------------- | --------------------------------------------------------- |
| **id**              | UUID          | PK                                     | Booking ID                                                |
| **event_id**        | UUID          | FK → events(id), NOT NULL              | The event                                                 |
| **ticket_type_id**  | UUID          | FK → ticket_types(id), NOT NULL        | What they bought                                          |
| amount_paid         | DECIMAL       | NOT_NULL                               | **Critical:** The price they actually paid at that moment |
| **purchaser_email** | VARCHAR       | NOT NULL                               | Email of person paying                                    |
| **payment_status**  | ENUM          | 'pending', 'paid', 'failed', ‘expired’ | Gateway status                                            |
| **payment_ref**     | VARCHAR       | NULL                                   | Stripe/Paystack reference ID                              |
| **created_at**      | TIMESTAMP     | DEFAULT NOW()                          | Booking time                                              |

📩 Table: attendees

The actual people holding tickets (1 booking can create multiple attendees).

| **Field**           | **Data Type** | **Constraints**             | **Description**           |
| ------------------- | ------------- | --------------------------- | ------------------------- |
| **id**              | UUID          | PK                          | Attendee ID               |
| **booking_id**      | UUID          | FK → bookings(id), NOT NULL | Link to payment           |
| **qr_code_hash**    | VARCHAR       | UNIQUE, NOT NULL            | Secure UUID for scanning  |
| **check_in_status** | BOOLEAN       | DEFAULT FALSE               | Have they entered?        |
| **check_in_time**   | TIMESTAMP     | NULL                        | Exact time of entry       |
| **checked_in_by**   | UUID          | FK → users(id), NULL        | Which staff scanned them? |

💬 Table: form_responses

This stores the "Answers" to the custom questions.

| **Field**          | **Data Type** | **Constraints**                | **Description**          |
| ------------------ | ------------- | ------------------------------ | ------------------------ |
| **id**             | UUID          | PK                             | Response ID              |
| **attendee_id**    | UUID          | FK → attendees(id), NOT NULL   | Who answered             |
| **form_field_id**  | UUID          | FK → form_fields(id), NOT NULL | Which question was asked |
| **response_value** | TEXT          | NOT NULL                       | The answer given         |

---

### 3. Services

- **Payment:** Paystack (application fee split)
- **Auth:** Better Auth (email/password + Google OAuth)
- **Email:** Nodemailer
- **QR Code:** node-qrcode
- **Cron Jobs:** server-scheduled tasks (for automatically updating the event status as dates pass)

---

## 3️⃣ Implementation

### A. Project Setup

Use Nuxt 4 & Nuxt UI 4 and follow:

---

### B. Features

- Authentication
- Event CRUD
- Form Builder
- Paystack Integration
- Booking creation after payment success
- Email QR Ticket sending
- QR Scanner
- Check-in Dashboard
- Event Analytics
- Status automation via cron

---

### C. Feature-by-Feature Implementation
