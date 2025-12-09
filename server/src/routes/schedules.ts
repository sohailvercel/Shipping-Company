import express, { Request, Response } from 'express';
import { protect, authorize } from '../middleware/auth';
import ISchedule from '../models/Schedule';
import { AuthRequest } from '../types';

const router = express.Router();

// @desc    Get all vessel schedules
// @route   GET /api/schedules
// @access  Public
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { vesselType } = req.query as { vesselType?: string };

    const filter: Record<string, any> = {};
    if (vesselType) filter.vesselType = vesselType;

    const schedules = await ISchedule.find(filter)
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
});

// @desc    Get single vessel schedule
// @route   GET /api/schedules/:id
// @access  Public
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const schedule = await ISchedule.findById(req.params.id)
      .populate('createdBy', 'email');

    if (!schedule) {
      res.status(404).json({
        success: false,
        error: 'Vessel schedule not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
});

// @desc    Create new vessel schedule
// @route   POST /api/schedules
// @access  Private (Admin only)
router.post(
  '/',
  protect,
  authorize('admin'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const {
        vesselName,
        vesselType,
        capacity,
        flag,
        currentLocation,
        voyages,
      } = req.body;

      if (!vesselName || !vesselType || !capacity || !flag || !currentLocation) {
        res.status(400).json({
          success: false,
          error: 'Please provide all required vessel information',
        });
        return;
      }

      if (!voyages || !Array.isArray(voyages) || voyages.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Please provide at least one voyage',
        });
        return;
      }

      for (const voyage of voyages) {
        const requiredVoyageFields = [
          'voyageNumber',
          'origin',
          'destination',
          'departure',
          'arrival',
          'status',
        ];
        for (const field of requiredVoyageFields) {
          if (!voyage[field]) {
            res.status(400).json({
              success: false,
              error: `Voyage is missing required field: ${field}`,
            });
            return;
          }
        }

        if (voyage.schedule && Array.isArray(voyage.schedule)) {
          for (const port of voyage.schedule) {
            const requiredPortFields = ['port', 'arrival', 'departure', 'status'];
            for (const field of requiredPortFields) {
              if (!port[field]) {
                res.status(400).json({
                  success: false,
                  error: `Port schedule is missing required field: ${field}`,
                });
                return;
              }
            }
          }
        }
      }

      const schedule = await ISchedule.create({
        vesselName,
        vesselType,
        capacity,
        flag,
        currentLocation,
        voyages,
        createdBy: req.user!._id,
      });

      await schedule.populate('createdBy', 'email');

      res.status(201).json({
        success: true,
        data: schedule,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Server error',
      });
    }
  }
);

// @desc    Update vessel schedule
// @route   PUT /api/schedules/:id
// @access  Private (Admin only)
router.put(
  '/:id',
  protect,
  authorize('admin'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const {
        vesselName,
        vesselType,
        capacity,
        flag,
        currentLocation,
        voyages,
      } = req.body;

      const updateData: any = {};

      if (vesselName) updateData.vesselName = vesselName;
      if (vesselType) updateData.vesselType = vesselType;
      if (capacity) updateData.capacity = capacity;
      if (flag) updateData.flag = flag;
      if (currentLocation) updateData.currentLocation = currentLocation;
      if (voyages && Array.isArray(voyages)) updateData.voyages = voyages;

      const schedule = await ISchedule.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('createdBy', 'email');

      if (!schedule) {
        res.status(404).json({
          success: false,
          error: 'Vessel schedule not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: schedule,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Server error',
      });
    }
  }
);

// @desc    Delete vessel schedule
// @route   DELETE /api/schedules/:id
// @access  Private (Admin only)
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const schedule = await ISchedule.findById(req.params.id);

      if (!schedule) {
        res.status(404).json({
          success: false,
          error: 'Vessel schedule not found',
        });
        return;
      }

      await schedule.deleteOne();

      res.status(200).json({
        success: true,
        message: 'Vessel schedule deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Server error',
      });
    }
  }
);

export default router;
