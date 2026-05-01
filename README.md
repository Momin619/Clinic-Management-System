# ClinicFlow

**ClinicFlow** is a full-stack MERN application built for clinic administration staff to manage patient appointments, track visit history, and automatically send WhatsApp confirmation and reminder messages to patients.

It is designed as a professional internal SaaS dashboard — patients do not need accounts. Everything is handled by the clinic staff through a clean, modern admin interface.

---

## Main Idea

The system is built around a single role:

- **Clinic Admin** — logs in securely, manages appointments, views patient history, monitors analytics, and receives automated WhatsApp notifications on behalf of patients.

Each appointment triggers an automatic **WhatsApp confirmation message** to the patient and schedules a **reminder message** before the appointment time — no manual follow-up required.

---

## Key Features

1. **Secure Authentication** — JWT-based login with access and refresh tokens stored in HTTP-only cookies
2. **Appointment Management** — Create, edit, delete, and filter appointments with duplicate booking prevention
3. **WhatsApp Automation** — Auto-send confirmation and scheduled reminder messages via WhatsApp API
4. **Patient History** — Full visit records with debounced search, filtering, and pagination
5. **Analytics Dashboard** — Daily, weekly, and monthly earnings with appointment statistics and charts
6. **Calendar View** — Monthly and daily schedule overview
7. **Export Features** — Export appointments as PDF or Excel, print appointment slips

---

## How the Core Logic Works

### 1. Authentication & Session Management

- Admin logs in with email and password (hashed with bcrypt).
- An **access token** (short-lived) and **refresh token** (long-lived) are issued and stored in HTTP-only cookies.
- When the access token expires, the system **automatically generates a new one** using the refresh token.
- If the refresh token also expires, the admin is **logged out automatically** and redirected to the login page with a session expired message.

### 2. Creating an Appointment

- Admin fills out the appointment form with:
  - Patient name, phone number, and WhatsApp number
  - Appointment date and time
  - Doctor name
  - Notes or remarks
- On submission, the appointment is saved to the database and a **WhatsApp confirmation message** is sent instantly.
- A **reminder job is scheduled** (e.g., 2 hours before the appointment) using Node Cron.

### 3. Appointment Status Flow

```
Confirmed → Completed → Cancelled
```

- **Confirmed**: Appointment is booked and patient is notified.
- **Completed**: Visit is done, recorded in patient history.
- **Cancelled**: Appointment was cancelled by admin.

### 4. WhatsApp Notifications

- **Confirmation Message** — sent immediately after booking:
  > "Your appointment has been confirmed for Monday at 4:00 PM."
- **Reminder Message** — sent automatically via cron job before appointment time:
  > "Reminder: Your appointment is scheduled in 2 hours."

### 5. Patient History

- All appointments are stored and linked to patient records by phone number.
- Admin can search by name, phone, doctor, status, or date.
- Each patient has a **detailed profile page** showing full visit history, notes, and contact info.

### 6. Analytics & Earnings

- Dashboard displays total, completed, and cancelled appointments.
- Earnings are tracked and broken down into **daily, weekly, and monthly** views.
- Charts and statistics cards give a clear overview of clinic performance.

---

## Technologies Used

### Backend

| Tool                    | Purpose                                 |
| ----------------------- | --------------------------------------- |
| Node.js + Express.js    | Server and REST API                     |
| MongoDB + Mongoose      | Database and data modeling              |
| JWT (jsonwebtoken)      | Access and refresh token authentication |
| bcrypt                  | Password hashing                        |
| cookie-parser           | Reading tokens from HTTP-only cookies   |
| Node Cron               | Scheduling WhatsApp reminder jobs       |
| Zod / express-validator | Request validation                      |
| ts-node-dev             | TypeScript development server           |

### Frontend

| Tool                                | Purpose                              |
| ----------------------------------- | ------------------------------------ |
| React with TypeScript               | UI framework                         |
| React Router                        | Page navigation and protected routes |
| Tailwind CSS                        | Styling and responsive layout        |
| Framer Motion                       | Animations and transitions           |
| Axios                               | HTTP requests with interceptors      |
| React Hook Form                     | Form handling and validation         |
| React Hot Toast                     | Toast notifications                  |
| Chart library (Recharts / Chart.js) | Analytics graphs                     |

### Integrations

| Tool                  | Purpose                             |
| --------------------- | ----------------------------------- |
| WhatsApp API / Twilio | Sending automated WhatsApp messages |

---

## Running the Project Locally

### Prerequisites

- Node.js (v18 or above)
- A MongoDB Atlas account (or local MongoDB)
- A WhatsApp API or Twilio account (for notifications)

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/clinicflow.git
cd clinicflow
```

---

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
WHATSAPP_API_KEY=your_whatsapp_or_twilio_key
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

The server will run at `http://localhost:5000`.

---

### 3. Set Up the Frontend

```bash
cd ../client
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

## Example Workflow

Here is a typical flow from start to finish:

1. **Admin logs in** to the clinic dashboard securely.
2. **Admin creates a new appointment** — fills in patient details, date, time, and doctor.
3. **System sends a WhatsApp confirmation** message to the patient instantly.
4. **Reminder cron job is scheduled** — patient receives a WhatsApp reminder 2 hours before the appointment.
5. **Admin views upcoming appointments** on the dashboard or calendar view.
6. **Admin marks appointment as completed** after the patient visits.
7. **Patient record is updated** — visit is saved to history with notes.
8. **Admin checks analytics** to review daily earnings and appointment trends.
9. **Admin searches patient history** by name or phone number for past records.
10. **Admin exports appointment data** as PDF or Excel if needed.

---

## Folder Structure

```
clinicflow/
├── server/
│   └── src/
│       ├── config/               # DB connection, env, cookie config
│       ├── modules/
│       │   ├── auth/             # Controller, service, routes, model, middleware
│       │   ├── appointments/     # Controller, service, routes, model, validator
│       │   ├── patients/         # Controller, service, routes, model, validator
│       │   ├── analytics/        # Controller, service, routes
│       │   └── notifications/    # WhatsApp service, notification types
│       ├── middleware/           # Auth, error handling, validation
│       ├── cron/                 # Appointment reminder cron job
│       ├── jobs/                 # Reminder job logic
│       ├── utils/                # API response, token generation, logger, date helpers
│       ├── app.ts
│       └── server.ts
│
└── client/
    └── src/
        ├── components/           # Reusable UI components
        ├── pages/                # Page-level components
        ├── layouts/              # Dashboard and auth layouts
        ├── hooks/                # Custom React hooks
        ├── services/             # Axios API service functions
        ├── context/              # Auth and global context
        ├── store/                # State management
        ├── types/                # TypeScript types and interfaces
        ├── utils/                # Helper functions
        ├── routes/               # Route definitions and guards
        └── lib/                  # Third-party library configs
```

---

## License

This project is licensed under the **MIT License**.

---

> Built for clinic staff who value efficiency, automation, and clean software.
