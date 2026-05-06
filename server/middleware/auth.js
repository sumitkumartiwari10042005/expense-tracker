import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {

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

    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      error: 'Invalid or expired access token'
    });

  }
}