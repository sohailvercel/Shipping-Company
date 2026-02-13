import { Request } from "express";
import { Types } from "mongoose";

/* ================= USER ================= */

export interface IUser {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  role: "admin" | "user";
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/* ================= GALLERY ================= */

export interface IGallery {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  uploadedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/* ================= BLOG ================= */

export interface IBlog {
  _id?: Types.ObjectId;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  externalLink?: string;
  category: string;
  author: string;
  authorRole: string;
  publishDate: Date;
  readTime: string;
  featured: boolean;
  tags: string[];
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/* ================= TARIFF ================= */

export interface ITariff {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  pdfUrl: string;
  category: string;
  uploadedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/* ================= SCHEDULE ================= */

export interface IPortSchedule {
  port: string;
  arrival: string;
  departure: string;
  status: "Completed" | "In Progress" | "Upcoming";
}

export interface IVoyage {
  voyageNumber: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  status: "On Time" | "Delayed" | "Completed";
  schedule: IPortSchedule[];
}

export interface ISchedule {
  _id?: Types.ObjectId;
  vesselName: string;
  vesselType: string;
  capacity: string;
  flag: string;
  currentLocation: string;
  voyages: IVoyage[];
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/* ================= REQUEST ================= */

export interface AuthRequest extends Request {
  user?: IUser;
}

/* ================= JWT ================= */

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

/* ================= FILE ================= */

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}
