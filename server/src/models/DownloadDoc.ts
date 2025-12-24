import mongoose, { Schema, Document } from "mongoose";

export interface IDownloadDoc extends Document {
    title: string;
    category: "import" | "export";
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const DownloadDocSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        category: { type: String, enum: ["import", "export"], required: true },
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileType: { type: String, required: true },
        uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IDownloadDoc>("DownloadDoc", DownloadDocSchema);
