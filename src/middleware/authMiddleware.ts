// import { Request, Response, NextFunction } from 'express';

// export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect('/login.html');
// };


// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const user = jwt.verify(token, 'your_jwt_secret_key');
    req.user = user; // Now TypeScript recognizes this property
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authenticateJWT;

