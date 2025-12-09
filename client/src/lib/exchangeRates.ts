import axios from "axios";

// Abstraction layer so components don't import axios directly
// Return typed results and normalize error handling.

export interface EffectiveRate {
  requestedDate: string; // YYYY-MM-DD
  sourceDate: string; // YYYY-MM-DD (last saved <= requested)
  rate: number;
}

// Fetch the effective exchange rate for a date (admin-only endpoint)
export async function getEffectiveRate(
  date: string
): Promise<EffectiveRate | null> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Invalid date format. Use YYYY-MM-DD");
  }
  try {
    const res = await axios.get(`/exchange-rates/effective/${date}`);
    return res.data?.data as EffectiveRate;
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw new Error(
      e?.response?.data?.error || "Failed to fetch effective rate"
    );
  }
}

// Public variant used by non-admin UI (server enforces feature flag)
export async function getEffectiveRatePublic(
  date: string
): Promise<EffectiveRate | null> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Invalid date format. Use YYYY-MM-DD");
  }
  try {
    const res = await axios.get(`/exchange-rates/effective-public/${date}`);
    return res.data?.data as EffectiveRate;
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    if (e?.response?.status === 403)
      throw new Error(e?.response?.data?.error || "Not allowed");
    throw new Error(
      e?.response?.data?.error || "Failed to fetch effective rate"
    );
  }
}

// Save or update a rate for an exact date (admin-only)
export async function saveRate(date: string, rate: number): Promise<void> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Invalid date format. Use YYYY-MM-DD");
  }
  if (typeof rate !== "number" || rate <= 0) {
    throw new Error("Rate must be a positive number");
  }
  try {
    await axios.post(`/exchange-rates`, { date, rate });
  } catch (e: any) {
    throw new Error(e?.response?.data?.error || "Failed to save rate");
  }
}
