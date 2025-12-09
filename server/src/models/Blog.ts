import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  externalLink?: string;
  category: string; // Dynamic category slug
  author: string;
  authorRole: string;
  publishDate: Date;
  readTime: string;
  featured: boolean;
  tags: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    excerpt: {
      type: String,
      required: [true, "Please add an excerpt"],
      maxlength: [300, "Excerpt cannot be more than 300 characters"],
    },
    content: {
      type: String,
      required: [true, "Please add content"],
      minlength: [10, "Content must be at least 10 characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Please add an image URL"],
    },
    externalLink: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: "Please provide a valid URL",
      },
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Please add an author name"],
      trim: true,
    },
    authorRole: {
      type: String,
      required: [true, "Please add an author role"],
      trim: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    readTime: {
      type: String,
      required: [true, "Please add read time"],
      default: "5 min read",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
BlogSchema.index({ category: 1, featured: 1, publishDate: -1 });
BlogSchema.index({ tags: 1 });

export default mongoose.model<IBlog>("Blog", BlogSchema);
