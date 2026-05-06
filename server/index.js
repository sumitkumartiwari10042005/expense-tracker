import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { initDB } from './db.js';
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

const PORT = process.env.PORT || 3000;

initDB().then(() =>
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  )
);