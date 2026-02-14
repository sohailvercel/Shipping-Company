import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest, JWTPayload } from '../types';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed: No token provided'
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('CRITICAL: JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, secret) as JWTPayload;

      // Support both id and userId for transition, but prefer userId
      const userId = decoded.userId || (decoded as any).id;

      if (!userId) {
        console.error('Protect Middleware Error: Token payload missing userId/id', decoded);
        return res.status(401).json({
          success: false,
          error: 'Authentication failed: Invalid token payload'
        });
      }

      // Get user from token
      const user = await User.findById(userId).select('-password');

      if (!user) {
        console.error(`Protect Middleware Error: User not found in DB for ID: ${userId}`);
        return res.status(401).json({
          success: false,
          error: 'Authentication failed: User no longer exists'
        });
      }

      req.user = user;
      return next();
    } catch (error: any) {
      console.error('Protect Middleware JWT Error:', error.message);
      return res.status(401).json({
        success: false,
        error: `Authentication failed: ${error.message || 'Invalid token'}`
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server error in authentication'
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    return next();
  };
};

