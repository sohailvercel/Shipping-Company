import express, { Request, Response } from "express";
import { protect, authorize } from "../middleware/auth";
import { uploadDoc, handleUploadError } from "../middleware/upload";
import ScheduleFile from "../models/ScheduleFile";
import { AuthRequest } from "../types";
import fs from 'fs';
import path from 'path';

const router = express.Router();

// @desc    Get current schedule file
// @route   GET /api/schedule-file
// @access  Public
router.get("/", async (req: Request, res: Response) => {
    try {
        const scheduleFile = await ScheduleFile.findOne().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: scheduleFile,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            error: error.message || "Server error",
        });
    }
});

// @desc    Upload/Replace schedule file
// @route   POST /api/schedule-file
// @access  Private (Admin only)
router.post(
    "/",
    protect,
    authorize("admin"),
    uploadDoc,
    handleUploadError,
    async (req: AuthRequest, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, error: "No file uploaded" });
            }

            // Find existing file to delete from disk
            const existingFile = await ScheduleFile.findOne();
            if (existingFile) {
                // Attempt to delete old file
                const oldPath = path.join(process.cwd(), 'uploads', path.basename(existingFile.fileUrl));
                fs.unlink(oldPath, (err) => {
                    if (err) console.error("Error deleting old file:", err);
                });
                // Delete old record
                await ScheduleFile.deleteOne({ _id: existingFile._id });
            }

            const host = req.get("host");
            const proto = req.protocol;
            const fileUrl = host
                ? `${proto}://${host}/uploads/${req.file.filename}`
                : `/uploads/${req.file.filename}`;

            const scheduleFile = await ScheduleFile.create({
                fileName: req.file.originalname,
                fileUrl,
                fileType: req.file.mimetype,
                uploadedBy: req.user!._id,
            });

            return res.status(201).json({ success: true, data: scheduleFile });
        } catch (error: any) {
            console.error("ScheduleFile POST error:", error);
            return res.status(500).json({
                success: false,
                error: error.message || "Server error",
            });
        }
    }
);

export default router;
