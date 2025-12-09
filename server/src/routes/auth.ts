import express from 'express';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/auth';
import { generateToken } from '../utils/jwt';
import User from '../models/User';
import { AuthRequest } from '../types';

const router = express.Router();

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password (cast to any to satisfy TS for instance methods)
    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token (cast jwt to any to avoid TS overload complaints)
    const token = (jwt as any).sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRE
    });

    return res.status(200).json({
      success: true,
      token,
      data: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during login'
    });
  }
}); // <-- close login route

// @desc    Create admin user
// @route   POST /api/auth/create-admin
// @access  Protected by admin creation key
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    // Verify admin creation key
    if (!adminKey || adminKey !== process.env.ADMIN_CREATION_KEY) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Invalid admin creation key'
      });
    }

    // Check if admin already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Create admin user
    const user = await User.create({
      email,
      password,
      role: 'admin'
    });

    const token = (jwt as any).sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRE
    });

    return res.status(201).json({
      success: true,
      token,
      data: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Admin creation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Error creating admin user'
    });
  }
});

export default router;