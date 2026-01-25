import express from "express";
import { protect, authorize } from "../middleware/auth";
import logger from "../utils/logger";

const router = express.Router();

router.get("/config", (req, res) => {
  const apiKey = process.env.WEB3FORMS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "API Key not configured" });
  }
  return res.json({ apiKey });
});

router.post("/", async (req, res) => {
  try {
    logger.info("Contact form submission received");
    logger.info("Request body:", req.body);
    const apiKey = process.env.WEB3FORMS_API_KEY;

    if (!apiKey) {
      logger.error("WEB3FORMS_API_KEY is not defined in environment variables");
      return res
        .status(500)
        .json({ message: "Server configuration error: API Key missing" });
    }

    // Map form fields properly for Web3Forms
    const { name, email, phone, company, subject, message, serviceType } =
      req.body;

const web3FormData = {
  access_key: apiKey,
  subject: subject || "New Contact Message",
  name: name || "Unknown",
  email: email || "noreply@example.com",
  message: `
Service Type: ${serviceType || "N/A"}
Phone: ${phone || "N/A"}
Company: ${company || "N/A"}

Message:
${message || "No message provided"}
`.trim(),
};


    logger.info("Sending request to Web3Forms with data:", web3FormData);
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(web3FormData),
    });

    const responseText = await response.text();
    logger.info("Web3Forms response status:", response.status);
    logger.info("Web3Forms response text:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      logger.error(
        "Failed to parse Web3Forms response as JSON:",
        responseText.substring(0, 500)
      );
      return res.status(500).json({
        message: "External API returned invalid response",
        details: responseText.substring(0, 200),
      });
    }

    logger.info("Web3Forms parsed data:", data);

    if (response.ok) {
      return res
        .status(200)
        .json({ success: true, message: "Message sent successfully", data });
    } else {
      logger.error("Web3Forms error:", data);
      return res
        .status(response.status)
        .json({
          success: false,
          message: "Failed to send message",
          error: data,
        });
    }
  } catch (error) {
    logger.error("Error sending email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
