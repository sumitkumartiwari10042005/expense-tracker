# 💸 Expense Lite

A modern personal expense tracker with user authentication, per-user data isolation, and a sleek dark UI — built with React, Express, and PostgreSQL.

![Expense Lite](https://img.shields.io/badge/Status-Live-brightgreen) ![Node](https://img.shields.io/badge/Node.js-v24-green) ![React](https://img.shields.io/badge/React-18-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E)

---

## 🌐 Live Demo

👉 [https://expense-tracker-1-cde9.onrender.com](https://expense-tracker-1-cde9.onrender.com)

---

## ✨ Features

- 🔐 **Auth** — Register & Login with JWT stored in HttpOnly cookies (XSS-safe)
- 👤 **Per-user data** — Every user sees only their own expenses
- 📊 **Category chart** — Live pie chart breakdown of spending
- 📅 **Monthly & yearly summary** — Filter expenses by month
- 📡 **Finance tips & news** — Rotating market tips in sidebar
- 💾 **Export CSV** — Download your expense history anytime
- 🌙 **Dark UI** — Animated background with orbs, grid, floating cards
- 📱 **Responsive** — Works on mobile too

---

## 🗂️ Project Structure

expense-lite/
├── client/
│   ├── node_modules/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategoryChart.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseList.jsx
│   │   │   └── Summary.jsx
│   │   ├── App.jsx
│   │   ├── Auth.jsx
│   │   ├── api.js
│   │   ├── styles.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── middleware/
│   │   └── auth.js
│   ├── node_modules/
│   ├── routes/
│   │   ├── auth.js
│   │   └── expenses.js
│   ├── server/
│   │   ├── .env
│   │   ├── db.js
│   │   ├── index.js
│   │   └── package.json
│   └── package.json
│
├── App.jsx          ← ye root mein kyun hai? Delete kar do!
├── package.json
└── README.md

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Custom CSS + Google Fonts (Sora, JetBrains Mono) |
| Charts | Chart.js + react-chartjs-2 |
| Backend | Node.js + Express |
| Database | PostgreSQL (Supabase) |
| Auth | JWT + HttpOnly Cookies |
| Deployment | Render |

---

## 🚀 Local Development

### Prerequisites

- Node.js v18+
- PostgreSQL database (local or [Supabase](https://supabase.com))

### 1. Clone

```bash
git clone https://github.com/sumitkumartiwari10042005/expense-tracker.git
cd expense-tracker
```

### 2. Install dependencies

```bash
# Server
npm install --prefix server

# Client
npm install --prefix client
```

### 3. Setup environment

Create `server/.env`:

```env
PORT=3000
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/expense_tracker
```

### 4. Run

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |

---

## 🗃️ Database Schema

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Expenses table
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Tables are **auto-created** on server start — no manual migration needed.

---

## 🔒 Security

- Passwords hashed with **bcryptjs** (10 salt rounds)
- JWT stored in **HttpOnly cookies** — not accessible via JavaScript
- `sameSite: strict` — CSRF protection
- `secure: true` in production — HTTPS only
- Per-user data isolation — users can only access their own expenses

---

## ☁️ Deployment (Render)

**Build Command:**

npm install --prefix server && npm install --prefix client --include=dev && npm run build --prefix client

**Start Command:**
node server/index.js

**Environment Variables:**
DATABASE_URL = your_supabase_connection_string
JWT_SECRET   = your_secret_key
NODE_ENV     = production

---

## 📄 License

MIT — use it however you like.

---

<div align="center">
  Made with 💜 by <a href="https://github.com/sumitkumartiwari10042005">Sumit Kumar Tiwari</a>
</div>