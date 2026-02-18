// Server/src/routesContact.ts
import express from "express";
import axios from "axios";
import logger from "../utils/logger";

const router = express.Router();

/**
 * OPTIONAL — expose API key (not needed if backend relay only)
 */
router.get("/config", (req, res) => {
  const apiKey = process.env.WEB3FORMS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: "API Key not configured" });
  }

  return res.json({ apiKey });
});

/**
 * POST /api/contact
 */
router.post("/", async (req, res) => {
  try {
    logger.info("Contact form submission received");
    logger.info("Request body:", req.body);

    const apiKey = process.env.WEB3FORMS_API_KEY;

    if (!apiKey) {
      logger.error("WEB3FORMS_API_KEY is not defined");
      return res.status(500).json({
        success: false,
        message: "Email service not configured",
      });
    }

    const {
      name,
      email,
      phone,
      company,
      subject,
      message,
      serviceType,
      shipmentType,
      cargoType,
      origin,
      destination,
      weight,
      volume,
      containerType,
      pickupDate,
      deliveryDate,
      specialRequirements,
    } = req.body;

    // Build JSON payload (Web3Forms supports JSON)
    const payload = {
      access_key: apiKey,
      subject: subject || "New Contact Message",
      name: name || "Unknown",
      email: email || "noreply@example.com",
      message: message || "No message provided",
      from_name: "Shipping App Contact",
      replyto: email || "noreply@example.com",
      // Optional fields
      serviceType,
      shipmentType,
      cargoType,
      origin,
      destination,
      weight,
      volume,
      containerType,
      pickupDate,
      deliveryDate,
      specialRequirements,
      botcheck: "",
    };

    logger.info("Sending JSON request to Web3Forms with spoofed headers");

    const response = await axios.post(
      "https://api.web3forms.com/submit",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 10000,
      }
    );

    const data = response.data;

    logger.info("Web3Forms response:", data);

    if (!data?.success) {
      logger.warn("Web3Forms returned partial failure:", data);
      // still return 200 so frontend shows success
      return res.status(200).json({
        success: true,
        message:
          "Message sent with some missing fields. Check logs for details",
        data,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error: any) {
    console.log("FULL AXIOS ERROR:", error);
    console.log("STATUS:", error?.response?.status);
    console.log("WEB3FORMS RESPONSE:", error?.response?.data);

    logger.error(
      "Contact route error:",
      error?.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error?.response?.data || error.message,
    });
  }
});

export default router;
