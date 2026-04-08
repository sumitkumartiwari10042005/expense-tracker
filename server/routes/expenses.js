import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all expenses
router.get("/", (req, res) => {
  db.all(
    "SELECT * FROM expenses ORDER BY created_at DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// ADD expense
router.post("/", (req, res) => {
  const { amount, note, category="Other" } = req.body;

  if (!amount) {
    return res.status(400).json({ error: "Amount required" });
  }

  db.run(
    "INSERT INTO expenses (amount, note, category,created_at) VALUES (?, ?, ?, ?)",
    [amount, note || "", category, Date.now()],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

// DELETE expense
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM expenses WHERE id = ?", [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

// UPDATE expense
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { amount, note, category = "Other" } = req.body;

  if (!amount) {
    return res.status(400).json({ error: "Amount required" });
  }

  db.run(
    "UPDATE expenses SET amount = ?, note = ?, category = ?  WHERE id = ?",
    [amount, note || "", category, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ success: true });
    }
  );
});

export default router;
