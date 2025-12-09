import express from "express";
import { Response, Request } from "express";
import { protect, authorize } from "../middleware/auth";
import TariffPage from "../models/TariffPage";
import ExchangeRate from "../models/ExchangeRate"; // historical effective-dated rate records

const router = express.Router();

// GET /api/tariffPage
// Public - returns the singleton tariff page
router.get("/", async (req: Request, res: Response) => {
  try {
    const doc = await TariffPage.findOne().lean();
    if (!doc) {
      return res
        .status(404)
        .json({ success: false, error: "Tariff page not found" });
    }
    return res.status(200).json({ success: true, data: doc });
  } catch (err: any) {
    console.error("Get tariff page error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Error fetching tariff page" });
  }
});

// PUT /api/tariffPage
// Admin only - replace/update whole tariff page
router.put(
  "/",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      // Prevent immutable field updates and restrict to known fields
      const { _id, __v, createdAt, updatedAt, ...rest } = req.body || {};

      // Optional: basic shape validation
      if (rest && typeof rest === "object") {
        // If companies present, ensure it's an array
        if (rest.companies && !Array.isArray(rest.companies)) {
          return res
            .status(400)
            .json({ success: false, error: "companies must be an array" });
        }
      }

      const update = {
        ...rest,
        updatedAt: new Date(),
      } as any;

      const updated = await TariffPage.findOneAndUpdate(
        {},
        { $set: update },
        {
          new: true,
          runValidators: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      ).lean();

      if (!updated) {
        return res
          .status(404)
          .json({ success: false, error: "Tariff page not found" });
      }
      return res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      console.error("Update tariff page error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Error updating tariff page" });
    }
  }
);

// PATCH /api/tariffPage/exchange (UNIFIED)
// Admin only - atomically set exchangeDate and exchangeRate for the tariff page.
// This replaces the deprecated /exchange-rate and /exchange-date endpoints.
// Contract:
//   Body: { exchangeDate: 'YYYY-MM-DD', exchangeRate: number > 0 }
//   Effect: Updates TariffPage.exchangeDate & TariffPage.exchangeRate together, writes / upserts historical ExchangeRate doc for that date.
router.patch(
  "/exchange",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const { exchangeDate, exchangeRate } = req.body as {
        exchangeDate?: string;
        exchangeRate?: number;
      };

      // Validate presence
      if (!exchangeDate || typeof exchangeDate !== "string") {
        return res.status(400).json({
          success: false,
          error: "exchangeDate (YYYY-MM-DD) is required",
        });
      }
      if (typeof exchangeRate !== "number") {
        return res.status(400).json({
          success: false,
          error: "exchangeRate (number) is required",
        });
      }
      if (exchangeRate <= 0) {
        return res.status(400).json({
          success: false,
          error: "exchangeRate must be greater than 0",
        });
      }

      // Validate date format
      const dateValid = /^\d{4}-\d{2}-\d{2}$/.test(exchangeDate);
      if (!dateValid) {
        return res.status(400).json({
          success: false,
          error: "exchangeDate must be in YYYY-MM-DD format",
        });
      }

      // Apply atomic update
      const updated = await TariffPage.findOneAndUpdate(
        {},
        {
          exchangeDate,
          exchangeRate,
          updatedAt: new Date(),
        },
        {
          new: true,
          runValidators: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      ).lean();

      // Persist historical effective rate for given date
      try {
        await ExchangeRate.findOneAndUpdate(
          { date: exchangeDate },
          { $set: { rate: exchangeRate } },
          { upsert: true, runValidators: true }
        );
      } catch (histErr) {
        console.warn("Failed to upsert historical exchange rate", histErr);
      }

      if (!updated) {
        return res
          .status(404)
          .json({ success: false, error: "Tariff page not found" });
      }
      return res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      console.error("Unified exchange patch error:", err);
      return res.status(500).json({
        success: false,
        error: "Error updating exchange data",
      });
    }
  }
);

// NOTE: The former endpoints /exchange-rate and /exchange-date have been removed.
// Clients must migrate to PATCH /api/tariffPage/exchange.

export default router;
