import express from "express";
import cors from "cors";
import expensesRoutes from "./routes/expenses.js";
import db from "./db.js";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Cleanup old expenses
const TWO_YEARS = 1000 * 60 * 60 * 24 * 365 * 2;
const cutoff = Date.now() - TWO_YEARS;  // ✅
db.run(                                  // ✅
  "DELETE FROM expenses WHERE created_at < ?",
  [cutoff],
  (err) => {
    if (err) {
      console.error("Cleanup error:", err.message);
    } else {
      console.log("Old expenses cleaned up");
    }
  }
);

// API routes
app.use("/expenses", expensesRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
