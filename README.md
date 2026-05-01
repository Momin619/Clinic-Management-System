# ClinicFlow

**ClinicFlow** is a full-stack MERN application for clinic administration staff to manage patient appointments, track visit history, and automatically send WhatsApp confirmation and reminder messages to patients.

Patients do not need accounts. Everything is managed by clinic staff through a modern admin dashboard.

---

## Key Features

1. **Secure Authentication** — JWT with access & refresh tokens in HTTP-only cookies
2. **Appointment Management** — Create, edit, delete, and filter appointments
3. **WhatsApp Automation** — Auto confirmation and scheduled reminder messages
4. **Patient History** — Full visit records with search, filtering, and pagination
5. **Analytics Dashboard** — Daily, weekly, and monthly earnings with charts
6. **Export** — Export appointments as PDF or Excel

---

## How It Works

- Admin logs in and creates appointments with patient details, date, time, and doctor.
- A **WhatsApp confirmation** is sent instantly after booking.
- A **Node Cron job** schedules a reminder message 2 hours before the appointment.
- Appointments flow through: `Confirmed → Completed → Cancelled`
- All visits are stored in patient history and searchable by name, phone, doctor, or date.

---

## Tech Stack

### Backend

| Tool                 | Purpose                      |
| -------------------- | ---------------------------- |
| Node.js + Express.js | Server and REST API          |
| MongoDB + Mongoose   | Database                     |
| JWT + bcrypt         | Auth and password hashing    |
| Node Cron            | WhatsApp reminder scheduling |
| TypeScript           | Type safety throughout       |

### Frontend

| Tool               | Purpose          |
| ------------------ | ---------------- |
| React + TypeScript | UI framework     |
| Tailwind CSS       | Styling          |
| Axios              | API requests     |
| React Hook Form    | Form handling    |
| React Hot Toast    | Notifications    |
| Recharts           | Analytics charts |

---

## Getting Started

```bash
git clone https://github.com/yourusername/clinicflow.git
cd clinicflow
```

**Backend:**

```bash
cd server && npm install && npm run dev
```

**Frontend:**

```bash
cd client && npm install && npm run dev
```

**Backend `.env`:**

```env
PORT=5000
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
WHATSAPP_API_KEY=your_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

## Folder Structure

```
clinicflow/
├── server/src/
│   ├── config/          # DB, env, cookies
│   ├── modules/         # auth, appointments, patients, analytics, notifications
│   ├── middleware/      # auth, error, validation
│   ├── cron/            # reminder cron job
│   └── utils/           # helpers
│
└── client/src/
    ├── components/
    ├── pages/
    ├── hooks/
    ├── services/
    ├── context/
    └── routes/
```

---

> Built for clinic staff who value efficiency and automation.
