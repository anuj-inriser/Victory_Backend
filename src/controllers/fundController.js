const axios = require("axios");

exports.getFundsAndMargin = async (req, res) => {
  try {
    const { segment } = req.query;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json({ success: false, message: "Auth token missing" });
    }

    // "Bearer xyz" → xyz extract
    const authToken = authHeader.replace("Bearer ", "").trim();
    const response = await axios.get(
      "https://apiconnect.angelone.in/rest/secure/angelbroking/user/v1/getRMS",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
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
    let amountAvail = 0;


    if (segment === "INTRADAY") {
      amountAvail = result?.data?.availableintradaypayin || 0;
    } else if (segment === "DELIVERY") {
      amountAvail = result?.data?.availablecash || 0;
    } else if (segment === "MARGIN") {
      amountAvail = result?.data?.availablelimitmargin || 0;
    }
    return res.json({ success: true, amountAvail });
  } catch (err) {
    console.error("Funds API Error:", err.message);
    return res.json({ success: false, message: "Unable to fetch funds." });
  }
};
