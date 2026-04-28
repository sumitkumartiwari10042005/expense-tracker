💸 Expense Lite
A lightweight personal expense tracker that lets you log expenses, categorize them, and visualize spending through pie charts and tables — all running locally with no cloud dependency.

✨ Features

Add and track daily expenses with custom categories
Visual breakdown via interactive pie charts
Tabular view of all expense entries
Persistent storage using SQLite (no external DB setup needed)
Fast, minimal UI built with React + Vite


🗂️ Project Structure
expense-lite/
├── server/         # Express + SQLite backend
└── client/         # React + Vite frontend

🚀 Getting Started (Local Dev)
Prerequisites
Make sure you have the following installed:
ToolVersionNode.jsv18+ recommendednpmcomes with Node.js

1. Clone the Repository
bashgit clone https://github.com/sumitkumartiwari10042005/expense-tracker.git
cd expense-lite

2. Setup & Run the Server
bashcd server
npm install
npm run dev
The server starts at http://localhost:3000 (or whichever port is configured in index.js).
Server Dependencies
PackagePurposeexpressHTTP server & REST APIcorsAllows frontend to talk to the backendsqlite3Local file-based database — no setup required

3. Setup & Run the Client
Open a new terminal, then:
bashcd client
npm install
npm run dev
The frontend starts at http://localhost:5173 (Vite default).
Client Dependencies
PackagePurposereact + react-domUI frameworkchart.jsChart rendering enginereact-chartjs-2React wrapper for Chart.jschartjs-plugin-datalabelsLabels on pie chart slicesviteDev server & bundler

4. Open the App
Go to http://localhost:5173 in your browser. Make sure the server is also running so the frontend can fetch and save data.

📦 Install All Dependencies (Quick Copy-Paste)
bash# Server
cd server && npm install

# Client (in a new terminal)
cd client && npm install

🛠️ Scripts
Server
CommandDescriptionnpm run devStart the backend servernpm startSame as dev (alias)
Client
CommandDescriptionnpm run devStart Vite dev server with hot reloadnpm run buildBuild for productionnpm run previewPreview the production build locally

🗃️ Database
Expense Lite uses SQLite via the sqlite3 package. The database file is created automatically when you first run the server — no manual setup or migrations needed.

📝 Notes

Both the server and client need to be running simultaneously during development.
The SQLite database file (e.g., expenses.db) will appear in the server/ directory after first run — don't delete it or you'll lose your data.
CORS is enabled on the server so the Vite dev server on port 5173 can communicate freely with the backend.


📄 License
MIT — use it however you like.
