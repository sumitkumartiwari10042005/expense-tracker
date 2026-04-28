import express from "express";
import cors from "cors";
import expensesRoutes from "./routes/expenses.js";
import db from "./db.js";
import { fileURLToPath } from 'url';


const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const TWO_YEARS = 1000 * 60 * 60 * 24 * 365 * 2;
const cutoff = Date.now() - TWO_YEARS;

db.run(
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

app.use("/expenses", expensesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const path = require("path");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
