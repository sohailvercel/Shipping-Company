import express, { Request, Response } from 'express';
import { protect, authorize } from '../middleware/auth';
import { uploadPdf, handleUploadError } from '../middleware/upload';
import Tariff from '../models/TariffPage';
import { AuthRequest } from '../types';

const router = express.Router();

// @desc    Get all tariffs
// @route   GET /api/tariffs
// @access  Public
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter: any = {};

    if (category && category !== 'all') filter.category = category;

    const tariffs = await Tariff.find(filter)
      .populate('uploadedBy', 'email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tariffs.length,
      data: tariffs,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
});

// @desc    Get single tariff
// @route   GET /api/tariffs/:id
// @access  Public
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const tariff = await Tariff.findById(req.params.id).populate('uploadedBy', 'email');

    if (!tariff) {
      return res.status(404).json({
        success: false,
        error: 'Tariff not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: tariff,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
});

// @desc    Upload new tariff
// @route   POST /api/tariffs
// @access  Private (Admin only)
router.post(
  '/',
  protect,
  authorize('admin'),
  uploadPdf,
  handleUploadError,
  async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, category } = req.body;

      if (!title || !description || !category) {
        return res.status(400).json({
          success: false,
          error: 'Please provide all required fields',
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Please upload a PDF file',
        });
      }

      const tariff = await Tariff.create({
        title,
        description,
        category,
        fileUrl: `/uploads/${req.file.filename}`,
        uploadedBy: req.user!._id,
      });

      await tariff.populate('uploadedBy', 'email');

      return res.status(201).json({
        success: true,
        data: tariff,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Server error',
      });
    }
  }
);

// @desc    Update tariff
// @route   PUT /api/tariffs/:id
// @access  Private (Admin only)
router.put(
  '/:id',
  protect,
  authorize('admin'),
  uploadPdf,
  handleUploadError,
  async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, category } = req.body;
      const updateData: any = { title, description, category };

      if (req.file) {
        updateData.fileUrl = `/uploads/${req.file.filename}`;
      }

      const tariff = await Tariff.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      }).populate('uploadedBy', 'email');

      if (!tariff) {
        return res.status(404).json({
          success: false,
          error: 'Tariff not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: tariff,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Server error',
      });
    }
  }
);

// @desc    Delete tariff
// @route   DELETE /api/tariffs/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const tariff = await Tariff.findById(req.params.id);

    if (!tariff) {
      return res.status(404).json({
        success: false,
        error: 'Tariff not found',
      });
    }

    await tariff.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Tariff deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
});

export default router;
