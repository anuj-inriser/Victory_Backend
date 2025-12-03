const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/get", async (req, res) => {
  try {
    const segment = req.query.segment || "INTRADAY";

   const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json({ success: false, message: "Auth token missing" });
    }

    const authToken = authHeader.replace("Bearer ", "").trim();

    // --- API CALL TO ANGELONE ---
    const response = await axios.get(
      "https://apiconnect.angelone.in/rest/secure/angelbroking/user/v1/getRMS",
      {
        headers: {
          Authorization: "Bearer " + authToken,
          "X-UserType": "USER",
          "X-SourceID": "WEB",
          "X-ClientLocalIP": "192.168.1.101",
          "X-ClientPublicIP": "103.55.41.12",
          "X-MACAddress": "10-02-B5-43-0E-B8",
          "X-PrivateKey": process.env.API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;

    // Extract amount based on segment
    let amountAvail = "0";

    if (segment === "INTRADAY") {
      amountAvail = result?.data?.availableintradaypayin || "0";
    } else if (segment === "DELIVERY") {
      amountAvail = result?.data?.availablecash || "0";
    } else if (segment === "MARGIN") {
      amountAvail = result?.data?.availablelimitmargin || "0";
    }
    return res.json({
      success: true,
      amountAvail,
    });
  } catch (error) {
    console.error("Funds Error:", error.message);
    return res.json({
      success: false,
      message: "Unable to fetch funds",
    });
  }
});

module.exports = router;
