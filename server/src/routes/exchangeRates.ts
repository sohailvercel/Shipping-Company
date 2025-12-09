import express from "express";
import { Request, Response } from "express";
import { protect, authorize } from "../middleware/auth";
import ExchangeRate from "../models/ExchangeRate";
import TariffPage from "../models/TariffPage";

const router = express.Router();

// Helper: validate YYYY-MM-DD
const isYMD = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

// GET /api/exchange-rates/:date (admin-only) -> {date, rate}
router.get(
  "/:date",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const { date } = req.params;
      if (!isYMD(date)) {
        return res
          .status(400)
          .json({ success: false, error: "date must be YYYY-MM-DD" });
      }
      const doc = await ExchangeRate.findOne({ date }).lean();
      if (!doc) {
        return res
          .status(404)
          .json({ success: false, error: "No exchange rate found for date" });
      }
      return res.status(200).json({ success: true, data: doc });
    } catch (err: any) {
      console.error("Get exchange rate by date error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Error fetching exchange rate" });
    }
  }
);

// GET /api/exchange-rates?from=YYYY-MM-DD&to=YYYY-MM-DD (admin-only) -> range
router.get(
  "/",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const { from, to } = req.query as { from?: string; to?: string };
      if (!from && !to) {
        // default: last 30 entries sorted desc by date
        const list = await ExchangeRate.find()
          .sort({ date: -1 })
          .limit(30)
          .lean();
        return res.status(200).json({ success: true, data: list });
      }

      if ((from && !isYMD(from)) || (to && !isYMD(to))) {
        return res.status(400).json({
          success: false,
          error: "from/to must be YYYY-MM-DD",
        });
      }

      const query: any = {};
      if (from || to) {
        query.date = {} as any;
        if (from) query.date.$gte = from;
        if (to) query.date.$lte = to;
      }

      const list = await ExchangeRate.find(query).sort({ date: 1 }).lean();
      return res.status(200).json({ success: true, data: list });
    } catch (err: any) {
      console.error("List exchange rates error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Error listing exchange rates" });
    }
  }
);

// GET /api/exchange-rates/effective/:date (admin-only)
// Returns last saved rate with date <= requestedDate
router.get(
  "/effective/:date",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const { date } = req.params;
      if (!isYMD(date)) {
        return res
          .status(400)
          .json({ success: false, error: "date must be YYYY-MM-DD" });
      }

      const doc = await ExchangeRate.findOne({ date: { $lte: date } })
        .sort({ date: -1 })
        .lean();
      if (!doc) {
        return res.status(404).json({
          success: false,
          error: "No rate found on or before requested date",
        });
      }

      return res.status(200).json({
        success: true,
        data: { requestedDate: date, sourceDate: doc.date, rate: doc.rate },
      });
    } catch (err: any) {
      console.error("Get effective exchange rate error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Error fetching effective rate" });
    }
  }
);

// GET /api/exchange-rates/effective-public/:date (public)
// POST /api/exchange-rates -> upsert rate for date (admin)
router.get("/effective-public/:date", async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    if (!isYMD(date)) {
      return res
        .status(400)
        .json({ success: false, error: "date must be YYYY-MM-DD" });
    }

    // Check tariff page flag
    const tariff = await TariffPage.findOne().lean();
    if (!tariff || !tariff.allowUserHistoricalRates) {
      return res
        .status(403)
        .json({ success: false, error: "Historical rates are not available" });
    }

    const doc = await ExchangeRate.findOne({ date: { $lte: date } })
      .sort({ date: -1 })
      .lean();
    if (!doc) {
      return res
        .status(404)
        .json({
          success: false,
          error: "No rate found on or before requested date",
        });
    }

    return res
      .status(200)
      .json({
        success: true,
        data: { requestedDate: date, sourceDate: doc.date, rate: doc.rate },
      });
  } catch (err: any) {
    console.error("Get effective public exchange rate error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Error fetching effective rate" });
  }
});

router.post(
  "/",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    // GET /api/exchange-rates/effective-public/:date (public)
    // Returns effective exchange rate for requested date only if admin enabled the feature
    router.get(
      "/effective-public/:date",
      async (req: Request, res: Response) => {
        try {
          const { date } = req.params;
          if (!isYMD(date)) {
            return res
              .status(400)
              .json({ success: false, error: "date must be YYYY-MM-DD" });
          }

          // Check tariff page flag
          const tariff = await TariffPage.findOne().lean();
          if (!tariff || !tariff.allowUserHistoricalRates) {
            return res.status(403).json({
              success: false,
              error: "Historical rates are not available",
            });
          }

          const doc = await ExchangeRate.findOne({ date: { $lte: date } })
            .sort({ date: -1 })
            .lean();
          if (!doc) {
            return res.status(404).json({
              success: false,
              error: "No rate found on or before requested date",
            });
          }

          return res.status(200).json({
            success: true,
            data: { requestedDate: date, sourceDate: doc.date, rate: doc.rate },
          });
        } catch (err: any) {
          console.error("Get effective public exchange rate error:", err);
          return res
            .status(500)
            .json({ success: false, error: "Error fetching effective rate" });
        }
      }
    );
    try {
      const { date, rate } = req.body as { date?: string; rate?: number };
      if (!date || !isYMD(date)) {
        return res
          .status(400)
          .json({ success: false, error: "date (YYYY-MM-DD) is required" });
      }
      if (typeof rate !== "number" || rate <= 0) {
        return res.status(400).json({
          success: false,
          error: "rate must be a positive number",
        });
      }

      const updated = await ExchangeRate.findOneAndUpdate(
        { date },
        { $set: { rate } },
        { new: true, upsert: true, runValidators: true }
      ).lean();

      return res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      console.error("Upsert exchange rate error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Error saving exchange rate" });
    }
  }
);

export default router;
