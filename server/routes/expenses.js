import express from 'express';
import { pool } from '../db.js';
import auth from '../middleware/auth.js';
const  router = express.Router();

// Sabhi routes protected hain
router.use(auth);

// GET - logged in user ke saare expenses
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM expenses WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST - naya expense add karo
router.post('/', async (req, res) => {
  const { amount, category, description, date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO expenses (user_id, amount, category, description, date) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, parseFloat(amount), category, description || null, date || new Date()]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE - expense hatao (sirf apna)
router.delete('/:id', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;