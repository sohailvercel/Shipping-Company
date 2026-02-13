import express from "express";
import axios from "axios";
import logger from "../utils/logger";

const router = express.Router();

/**
 * Optional: expose API key to frontend if needed
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

const web3FormData = {
  access_key: apiKey,
  subject: subject || "New Contact Message",
  name: name || "Unknown",
  email: email || "noreply@example.com",
  message: message || "No message provided",
};


    logger.info("Sending request to Web3Forms");

    const response = await axios.post(
      "https://api.web3forms.com/submit",
      web3FormData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 seconds safety timeout
      }
    );

    const data = response.data;

    logger.info("Web3Forms response:", data);

    if (!data?.success) {
      logger.error("Web3Forms returned failure:", data);
      return res.status(400).json({
        success: false,
        message: "Failed to send message",
        error: data,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error: any) {
    logger.error("Contact route error:", error?.response?.data || error);

    return res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error?.response?.data || error.message,
    });
  }
});

export default router;
