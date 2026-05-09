import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './db.js';
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';
import rateLimit from 'express-rate-limit';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://expense-tracker-1-cde9.onrender.com'
    : 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 attempts
  message: { error: 'Too many attempts, try after 15 minutes' }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // expenses pe relaxed — 100 requests
  message: { error: 'Too many requests, slow down!' }
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/expenses',apiLimiter, expenseRoutes);

// Production me React serve karo
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../client/dist');  // ✅ fix
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
initDB().then(() =>
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
);