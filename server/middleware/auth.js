import jwt from 'jsonwebtoken';
import { pool } from '../db.js'; 

export default async function auth(req, res, next) {

  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    return res.status(401).json({
      error: 'Access token missing'
    });
  }

  try {

    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET
    );
    
    const result = await pool.query('SELECT id, email FROM users WHERE id = $1', [decoded.id]);

     if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found, please login again' });
    }

    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      error: 'Invalid or expired access token'
    });

  }
}