import express, { Request, Response } from "express";
import { protect, authorize } from "../middleware/auth";
import { uploadDoc, handleUploadError } from "../middleware/upload";
import DownloadDoc from "../models/DownloadDoc";
import fs from "fs";
import path from "path";

const router = express.Router();

// @desc    Get all documents for a category
// @route   GET /api/download-docs/category/:category
// @access  Public
router.get("/category/:category", async (req: Request, res: Response) => {
    try {
        const { category } = req.params;
        const docs = await DownloadDoc.find({ category }).sort({ createdAt: -1 });
        return res.json({ success: true, count: docs.length, data: docs });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Upload a new document
// @route   POST /api/download-docs
// @access  Private/Admin
router.post(
    "/",
    protect,
    authorize("admin"),
    uploadDoc,
    async (req: Request, res: Response) => {
        try {
            const { title, category } = req.body;
            if (!req.file) {
                return res.status(400).json({ success: false, message: "Please upload a file" });
            }

            const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

            const doc = await DownloadDoc.create({
                title,
                category,
                fileName: req.file.originalname,
                fileUrl,
                fileType: req.file.mimetype,
                uploadedBy: (req as any).user._id,
            });

            return res.status(201).json({ success: true, data: doc });
        } catch (err: any) {
            return res.status(500).json({ success: false, message: err.message });
        }
    },
    handleUploadError
);

// @desc    Delete a document
// @route   DELETE /api/download-docs/:id
// @access  Private/Admin
router.delete("/:id", protect, authorize("admin"), async (req: Request, res: Response): Promise<any> => {
    try {
        const doc = await DownloadDoc.findById(req.params.id);

        if (!doc) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        // Delete file from filesystem
        const fileName = doc.fileUrl.split("/").pop();
        if (fileName) {
            const filePath = path.join(process.cwd(), "uploads", fileName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await doc.deleteOne();

        return res.json({ success: true, message: "Document removed" });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
