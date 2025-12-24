import express from "express";

import path from "path";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";

// Import routes
import authRoutes from "./routes/auth";
import galleryRoutes from "./routes/gallery";
import blogRoutes from "./routes/blogs";
import categoriesRoutes from "./routes/categories";
import tariffRoutes from "./routes/tariffs";
import tariffPageRoutes from "./routes/tariffPage";
import exchangeRatesRoutes from "./routes/exchangeRates";
import contactRoutes from "./routes/contact";
import configRoutes from "./routes/config";
import scheduleFileRoutes from "./routes/scheduleFile";
import downloadDocsRoutes from "./routes/downloadDocs";
// import scheduleRoutes from "./routes/schedules";
import User from "./models/User";
import seedAdmin from "./utils/seedAdmin";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

/* ------------------------- DATABASE CONNECTION ------------------------- */
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

/* ------------------------- MIDDLEWARE ------------------------- */
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Serve uploaded files
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

/* ------------------------- ROUTES ------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/tariffs", tariffRoutes);
app.use("/api/tariffPage", tariffPageRoutes);
app.use("/api/exchange-rates", exchangeRatesRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/config", configRoutes);
app.use("/api/schedule-file", scheduleFileRoutes);
app.use("/api/download-docs", downloadDocsRoutes);
// app.use("/api/schedules", scheduleRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

app.use(notFound);
app.use(errorHandler);

/* ------------------------- START SERVER ------------------------- */
const PORT = process.env.PORT || 5000;
let server: ReturnType<typeof import("http").createServer> | null = null;

const startServer = async () => {
  try {
    await connectDB();

    // seed initial data
    await seedAdmin();

    server = app.listen(PORT, () => {
      console.log(
        `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Rejection:", err.message);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});
