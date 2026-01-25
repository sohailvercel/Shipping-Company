import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";

// Load environment variables
dotenv.config();

// Utils & Middleware
import logger from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";

// Routes
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

// Seed admin
import seedAdmin from "./utils/seedAdmin";

// ------------------------- EXPRESS APP -------------------------
const app = express();

// ------------------------- DATABASE -------------------------
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not defined in .env");
  }

  await mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 10,
    connectTimeoutMS: 30000,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    retryWrites: true,
  });

  logger.info("✅ MongoDB connected");
};

// ------------------------- MIDDLEWARE -------------------------
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.text({ type: "*/*" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logging with morgan -> winston
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: { write: (msg) => logger.http(msg.trim()) },
  })
);

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100,
  })
);

// ------------------------- API ROUTES -------------------------
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

// ------------------------- ROOT & HEALTH -------------------------
app.get("/", (_req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", time: new Date() });
});

// Optional: prevent favicon 404s
app.get("/favicon.ico", (_req, res) => res.status(204).end());

// ------------------------- ERROR HANDLING -------------------------
app.use(notFound);
app.use(errorHandler);

// ------------------------- START SERVER -------------------------
const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    await seedAdmin();
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error(`❌ Startup error: ${err}`);
    process.exit(1);
  });

export default app;
