import express from 'express';

const router = express.Router();

/**
 * @desc    Get tracking URL
 * @route   GET /api/config/tracking-url
 * @access  Public
 */
router.get('/tracking-url', (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            trackingUrl: process.env.TRACKING_URL || '',
            whatsappNumber: process.env.WHATSAPP_NUMBER || '+923333636403'
        }
    });
});

export default router;
