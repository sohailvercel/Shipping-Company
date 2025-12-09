import mongoose, { Schema, Document } from "mongoose";

export interface IGallery extends Document {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string; // Dynamic category slug from Category model
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Please add an image URL"],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for better query performance
GallerySchema.index({ category: 1, createdAt: -1 });

export default mongoose.model<IGallery>("Gallery", GallerySchema);
