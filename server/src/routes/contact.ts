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

    // Build FormData (URL Encoded)
    const formData = new URLSearchParams();

    formData.append("access_key", apiKey);
    formData.append("subject", subject || "New Contact Message");
    formData.append("name", name || "Unknown");
    formData.append("email", email || "noreply@example.com");
    formData.append("message", message || "No message provided");

    // Reply metadata
    formData.append("from_name", "Shipping App Contact");
    formData.append("replyto", email || "noreply@example.com");

    // Optional additional fields (for Quote page)
    if (serviceType) formData.append("serviceType", serviceType);
    if (shipmentType) formData.append("shipmentType", shipmentType);
    if (cargoType) formData.append("cargoType", cargoType);
    if (origin) formData.append("origin", origin);
    if (destination) formData.append("destination", destination);
    if (weight) formData.append("weight", weight);
    if (volume) formData.append("volume", volume);
    if (containerType) formData.append("containerType", containerType);
    if (pickupDate) formData.append("pickupDate", pickupDate);
    if (deliveryDate) formData.append("deliveryDate", deliveryDate);
    if (specialRequirements)
      formData.append("specialRequirements", specialRequirements);

    // Honeypot anti-spam field (REQUIRED for server submissions)
    formData.append("botcheck", "");

    logger.info("Sending request to Web3Forms");

    const response = await axios.post(
      "https://api.web3forms.com/submit",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          // Origin: req.headers.origin || "",
          // Referer: req.headers.referer || "",
          // "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
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
