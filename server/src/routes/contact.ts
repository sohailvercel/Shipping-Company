import express from "express";

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
        console.log("Contact form submission received");
        console.log("Request body:", req.body);
        const apiKey = process.env.WEB3FORMS_API_KEY;

        if (!apiKey) {
            console.error("WEB3FORMS_API_KEY is not defined in environment variables");
            return res.status(500).json({ message: "Server configuration error: API Key missing" });
        }

        console.log("Sending request to Web3Forms...");
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            body: JSON.stringify({
                access_key: apiKey,
                ...req.body,
            }),
        });

        const responseText = await response.text();
        console.log("Web3Forms response status:", response.status);
        console.log("Web3Forms response text:", responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error("Failed to parse Web3Forms response as JSON");
            return res.status(500).json({
                message: "External API returned invalid response",
                details: responseText.substring(0, 200)
            });
        }

        console.log("Web3Forms parsed data:", data);

        if (response.ok) {
            return res.status(200).json(data);
        } else {
            console.error("Web3Forms error:", data);
            return res.status(response.status).json(data);
        }
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
            message: "Failed to send email",
            error: error instanceof Error ? error.message : String(error)
        });
    }
});

export default router;
