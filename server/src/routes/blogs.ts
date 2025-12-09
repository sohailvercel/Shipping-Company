import express, { Request, Response } from "express";
import { protect, authorize } from "../middleware/auth";
import { uploadSingle, handleUploadError } from "../middleware/upload";
import IBlog from "../models/Blog";
import { AuthRequest } from "../types";

const router = express.Router();

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, featured } = req.query;

    let filter: any = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    if (featured === "true") {
      filter.featured = true;
    }

    const blogs = await IBlog.find(filter)
      .populate("createdBy", "email")
      .sort({ publishDate: -1 });

    return res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
});

// @desc    Get single blog post
// @route   GET /api/blogs/:id
// @access  Public
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const blog = await IBlog.findById(req.params.id).populate(
      "createdBy",
      "email"
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
});

// @desc    Add new blog post
// @route   POST /api/blogs
// @access  Private (Admin only)
router.post(
  "/",
  protect,
  authorize("admin"),
  uploadSingle,
  handleUploadError,
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        title,
        excerpt, // short description
        content, // full content (optional for our simplified flow)
        externalLink,
        category,
        author,
        authorRole,
        readTime,
        featured,
        tags,
        publishDate,
      } = req.body;

      if (!title || !excerpt || !author || !authorRole) {
        return res.status(400).json({
          success: false,
          error: "Please provide all required fields",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "Please upload an image",
        });
      }

      let parsedTags: string[] = [];
      if (tags) {
        if (typeof tags === "string") {
          parsedTags = tags.split(",").map((tag) => tag.trim());
        } else if (Array.isArray(tags)) {
          parsedTags = tags;
        }
      }

      const blog = await IBlog.create({
        title,
        excerpt,
        content: content && content.trim().length > 0 ? content : excerpt,
        imageUrl: `/uploads/${req.file.filename}`,
        externalLink: externalLink || undefined,
        category: (category as any) || "company",
        author,
        authorRole,
        readTime: readTime || "5 min read",
        featured: featured === "true" || featured === true,
        tags: parsedTags,
        publishDate: publishDate ? new Date(publishDate) : undefined,
        createdBy: req.user!._id,
      });

      await blog.populate("createdBy", "email");

      return res.status(201).json({
        success: true,
        data: blog,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || "Server error",
      });
    }
  }
);

// @desc    Update blog post
// @route   PUT /api/blogs/:id
// @access  Private (Admin only)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  uploadSingle,
  handleUploadError,
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        title,
        excerpt,
        content,
        externalLink,
        category,
        author,
        authorRole,
        readTime,
        featured,
        tags,
      } = req.body;

      let updateData: any = {
        title,
        excerpt,
        content,
        category,
        author,
        authorRole,
      };

      if (externalLink) updateData.externalLink = externalLink;
      if (readTime) updateData.readTime = readTime;
      if (featured !== undefined)
        updateData.featured = featured === "true" || featured === true;

      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
      }

      if (tags) {
        let parsedTags: string[] = [];
        if (typeof tags === "string") {
          parsedTags = tags.split(",").map((tag) => tag.trim());
        } else if (Array.isArray(tags)) {
          parsedTags = tags;
        }
        updateData.tags = parsedTags;
      }

      const blog = await IBlog.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      }).populate("createdBy", "email");

      if (!blog) {
        return res.status(404).json({
          success: false,
          error: "Blog post not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: blog,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || "Server error",
      });
    }
  }
);

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id
// @access  Private (Admin only)
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  async (req: AuthRequest, res: Response) => {
    try {
      const blog = await IBlog.findById(req.params.id);

      if (!blog) {
        return res.status(404).json({
          success: false,
          error: "Blog post not found",
        });
      }

      await blog.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Blog post deleted successfully",
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
