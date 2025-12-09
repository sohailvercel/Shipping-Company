import { Request } from "express";
import { Document } from "mongoose";

// User types
export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Gallery types
export interface IGallery extends Document {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string; // Dynamic category slug
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Blog types
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
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tariff types
export interface ITariff extends Document {
  _id: string;
  title: string;
  description: string;
  pdfUrl: string;
  category: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schedule types
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

export interface ISchedule extends Document {
  _id: string;
  vesselName: string;
  vesselType: string;
  capacity: string;
  flag: string;
  currentLocation: string;
  voyages: IVoyage[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Request types
export interface AuthRequest extends Request {
  user?: IUser;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// File upload types
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
