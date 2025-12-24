import mongoose, { Schema, Document } from "mongoose";

export interface IScheduleFile extends Document {
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ScheduleFileSchema = new Schema<IScheduleFile>(
    {
        fileName: {
            type: String,
            required: true,
            trim: true,
        },
        fileUrl: {
            type: String,
            required: true,
        },
        fileType: {
            type: String,
            required: true,
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

export default mongoose.model<IScheduleFile>("ScheduleFile", ScheduleFileSchema);
