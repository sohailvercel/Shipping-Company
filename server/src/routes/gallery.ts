import express, { Request, Response } from "express";
import { protect, authorize } from "../middleware/auth";
import { uploadSingle, handleUploadError } from "../middleware/upload";
import Gallery from "../models/Gallery"; // ✅ fix: import the *model*, not the interface
import { AuthRequest } from "../types";

const router = express.Router();

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter: any = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    const gallery = await Gallery.find(filter)
      .populate("uploadedBy", "email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: gallery.length,
      data: gallery,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
});

// @desc    Get single gallery image
// @route   GET /api/gallery/:id
// @access  Public
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const gallery = await Gallery.findById(req.params.id).populate(
      "uploadedBy",
      "email"
    );

    if (!gallery) {
      return res.status(404).json({
        success: false,
        error: "Gallery image not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
});

// @desc    Add new gallery image
// @route   POST /api/gallery
// @access  Private (Admin only)
router.post(
  "/",
  protect,
  authorize("admin"),
  uploadSingle,
  handleUploadError,
  async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, category } = req.body;

      // Log incoming body for debugging
      console.log("Gallery upload body:", req.body);

      if (!title || !description || !category) {
        console.warn("Gallery upload missing fields:", {
          title,
          description,
          category,
        });
        return res
          .status(400)
          .json({ success: false, error: "Missing fields" });
      }

      if (!req.file) {
        console.warn("Gallery upload no file in request");
        return res
          .status(400)
          .json({ success: false, error: "No file uploaded" });
      }

      // Debug: where multer saved the file
      console.log("Gallery upload req.file:", {
        filename: req.file.filename,
        path: req.file.path,
        destination: req.file.destination,
      });

      // Ensure we have an authenticated user (protect middleware should provide this)
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, error: "Not authorized" });
      }

      // Return an absolute URL so clients do not need to guess origin
      const host = req.get("host");
      const proto = req.protocol;
      const imageUrl = host
        ? `${proto}://${host}/uploads/${req.file.filename}`
        : `/uploads/${req.file.filename}`;

      const gallery = await Gallery.create({
        title,
        description,
        imageUrl,
        category,
        uploadedBy: req.user._id,
      });

      await gallery.populate("uploadedBy", "email");

      return res.status(201).json({ success: true, data: gallery });
    } catch (error: any) {
      // Log full error on server for debugging
      // eslint-disable-next-line no-console
      console.error("Gallery POST error:", error);
      const isDev = process.env.NODE_ENV !== "production";
      return res.status(500).json({
        success: false,
        error: error.message || "Server error",
        ...(isDev ? { stack: error.stack } : {}),
      });
    }
  }
);

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Private (Admin only)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  uploadSingle,
  handleUploadError,
  async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, category } = req.body;
      const updateData: any = { title, description, category };

      if (req.file) {
        const host = req.get("host");
        const proto = req.protocol;
        updateData.imageUrl = host
          ? `${proto}://${host}/uploads/${req.file.filename}`
          : `/uploads/${req.file.filename}`;
      }

      // Ensure we have an authenticated user
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, error: "Not authorized" });
      }

      const gallery = await Gallery.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate("uploadedBy", "email");

      if (!gallery) {
        return res.status(404).json({
          success: false,
          error: "Gallery image not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: gallery,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || "Server error",
      });
    }
  }
);

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private (Admin only)
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  async (req: AuthRequest, res: Response) => {
    try {
      const gallery = await Gallery.findById(req.params.id);

      if (!gallery) {
        return res.status(404).json({
          success: false,
          error: "Gallery image not found",
        });
      }

      await gallery.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Gallery image deleted successfully",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || "Server error",
      });
    }
  }
);

export default router;
