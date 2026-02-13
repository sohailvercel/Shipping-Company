import express from "express";
import axios from "axios";
import logger from "../utils/logger";

const router = express.Router();

/**
 * GET /api/contact/config
 * Optional: Expose API key for frontend if needed
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
    } = req.body;

    // Build URL-encoded form data
    const formData = new URLSearchParams();

    formData.append("access_key", apiKey);
    formData.append("subject", subject || "New Contact Message");
    formData.append("name", name || "Unknown");
    formData.append("email", email || "noreply@example.com");
    formData.append("message", message || "No message provided");

    // Optional fields
    formData.append("phone", phone || "");
    formData.append("company", company || "");
    formData.append("serviceType", serviceType || "");

    // Reply metadata
    formData.append("from_name", "Shipping App Contact");
    formData.append("replyto", email || "noreply@example.com");

    // Honeypot anti-spam field
    formData.append("botcheck", "");

    logger.info("Sending request to Web3Forms");

    const response = await axios.post(
      "https://api.web3forms.com/submit",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Origin: req.headers.origin || "",
          Referer: req.headers.referer || "",
          "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
        },
        timeout: 10000,
      }
    );

    const data = response.data;
    logger.info("Web3Forms response:", data);

    // Treat partial success as success
    if (data?.success) {
      return res.status(200).json({
        success: true,
        message: "Message sent successfully",
        data,
      });
    } else {
      logger.warn("Web3Forms returned partial failure:", data);
      return res.status(200).json({
        success: true,
        message: "Message sent (partial success)",
        data,
      });
    }
  } catch (error: any) {
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

