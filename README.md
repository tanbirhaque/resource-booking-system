# 🗓️ Resource Booking System

A full-stack mini app that allows users to book time slots for shared resources (like rooms or devices) — with **conflict detection**, **buffer logic**, and a filterable booking dashboard.

> ✅ Built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Prisma + SQLite**

---

## 🚀 Live Demo

👉 [View Deployed App on Vercel](https://resource-booking-system-8f54.onrender.com/)

> **Note:** Vercel serverless functions do not support SQLite writes, so the backend API may not function correctly in production. Use it locally or consider moving to Render for full backend support.

---

## 🛠 Features

### 📋 Booking Form

- Select a **resource**
- Pick **start time** and **end time**
- Add **"Requested By"** field
- **Validations:**

  - End time must be after start time
  - Duration must be at least 15 minutes

### ✅ Booking Rules

- Prevents overlapping bookings **with 10-minute buffer** before and after each slot
- Example: A booking from 2:00–3:00 PM blocks 1:50–3:10 PM
- Bookings must fall **outside buffer zones**

### 📥 API Endpoints

- `POST /api/bookings`: Create booking (with conflict + buffer check)
- `GET /api/bookings`: Fetch all bookings

  - Supports filters: `?resource=Room A&date=2025-07-23`

### 📊 Booking Dashboard

- View all bookings grouped by resource
- Filter by **resource** and **date**
- Tag bookings as:

  - **Upcoming**
  - **Ongoing**
  - **Past**

### 🧪 Bonus Features (if implemented)

- [x] Delete a booking
- [x] Weekly calendar view (TBD)
- [x] Max duration limit (e.g. 2 hours)
- [x] Available slots API: `GET /api/available-slots`

---

## 🧱 Tech Stack

| Layer      | Technology                                     |
| ---------- | ---------------------------------------------- |
| Frontend   | Next.js (App Router), Tailwind CSS, TypeScript |
| Backend    | Next.js Route Handlers (API Routes)            |
| Database   | SQLite with Prisma ORM                         |
| Styling    | Tailwind CSS                                   |
| Deployment | Render                                         |

---

## ⚙️ Getting Started Locally

```bash
# 1. Clone the repo
git clone https://github.com/tanbirhaque/resource-booking-system.git
cd resource-booking-system

# 2. Install dependencies
pnpm install

# 3. Generate Prisma client
npx prisma generate

# 4. Migrate & seed (if applicable)
npx prisma migrate dev --name init

# 5. Start the dev server
pnpm dev
```

> Your app should now be running at `http://localhost:3000`

---

## 🧩 Prisma & SQLite Notes

- Prisma uses a local SQLite database (`./prisma/dev.db`)
- Database is stored **locally**, not supported in Vercel’s serverless environment
- For full backend functionality, run locally or deploy to **Render / Railway / VPS**

---

## 📁 Project Structure

```
/app
  /api/bookings        → API route handlers (GET, POST)
  /dashboard           → Booking list + filter UI
  /page.tsx            → Home page (Booking Form)

/lib/prisma.ts         → Prisma client singleton
/prisma/schema.prisma  → SQLite schema
```

---

## 📌 Known Limitations

- ❌ No authentication implemented (anyone can book/delete for now)
