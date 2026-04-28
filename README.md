# 💸 Expense Lite

A lightweight personal expense tracker that lets you log expenses, categorize them, and visualize spending through pie charts and tables — all running locally with no cloud dependency.

---

## ✨ Features

- Add and track daily expenses with custom categories
- Visual breakdown via interactive **pie charts**
- Tabular view of all expense entries
- Persistent storage using **SQLite** (no external DB setup needed)
- Fast, minimal UI built with **React + Vite**

---

## 🗂️ Project Structure

```
expense-tracker/
├── client/         # React + Vite frontend
├── server/         # Express + SQLite backend
└── package.json    # Root runner (starts both at once)
```

---

## 🚀 Getting Started (Local Dev)

### Prerequisites

Make sure you have the following installed:

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org/) | v18+ recommended |
| npm | comes with Node.js |

---

### 1. Clone the Repository

```bash
git clone https://github.com/sumitkumartiwari10042005/expense-tracker.git
cd expense-tracker
```

---

### 2. Install All Dependencies

Install dependencies for root, server, and client:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

---

### 3. Run the App

From the **root directory**, start both frontend and backend at once:

```bash
npm run dev
```

This uses `concurrently` to launch both in a single terminal — no need to open multiple tabs.

| Service | URL |
|---------|-----|
| Frontend (Vite) | http://localhost:5173 |
| Backend (Express) | http://localhost:3000 |

---

## 🛠️ Scripts

### Root (run from project root)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client and server simultaneously |
| `npm run client` | Start only the frontend |
| `npm run server` | Start only the backend |

### Client (`/client`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |

### Server (`/server`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Express server |
| `npm start` | Same as dev (alias) |

---

## 📦 Dependencies

### Root

| Package | Purpose |
|---------|---------|
| `concurrently` | Run client and server scripts simultaneously |
| `npm-run-all` | Utility for running multiple npm scripts |

### Server

| Package | Purpose |
|---------|---------|
| `express` | HTTP server & REST API |
| `cors` | Allows the frontend to communicate with the backend |
| `sqlite3` | Local file-based database — no setup required |

### Client

| Package | Purpose |
|---------|---------|
| `react` + `react-dom` | UI framework |
| `chart.js` | Chart rendering engine |
| `react-chartjs-2` | React wrapper for Chart.js |
| `chartjs-plugin-datalabels` | Labels on pie chart slices |
| `vite` | Dev server & bundler |

---

## 🗃️ Database

Expense Lite uses **SQLite** via the `sqlite3` package. The database file is created automatically when you first run the server — no manual setup or migrations needed. You'll find it (e.g., `expenses.db`) inside the `server/` folder after first run — don't delete it or you'll lose your data.

---

## 📄 License

MIT — use it however you like.
