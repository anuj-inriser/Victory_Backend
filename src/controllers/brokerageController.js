const axios = require("axios");

exports.calculateBrokerage = async (req, res) => {
  try {
    const { price, quantity, segment, symbol, symboltoken, exchange } = req.query;

    if (!price || !quantity || !symbol || !symboltoken || !exchange) {
      return res.status(400).json({
        success: false,
        message: "Missing required params",
      });
    }

    const authToken = req.headers["authorization"]?.replace("Bearer ", "");

    const data = {
      orders: [
        {
          product_type: segment || "DELIVERY",
          transaction_type: "BUY",
          quantity: quantity,
          price: price,
          exchange: exchange,
          symbol_name: symbol,
          token: symboltoken,
        },
      ],
    };

    const response = await axios({
      method: "post",
      url: "https://apiconnect.angelone.in/rest/secure/angelbroking/brokerage/v1/estimateCharges",
      maxBodyLength: Infinity,
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
      data: data,  // ⭐IMPORTANT⭐ exactly yahi chahiye
    });
    const breakups = response.data?.data?.summary?.breakup || [];
    const angelOneBrokerage =
    breakups.find((x) => x.name === "Angel One Brokerage")?.amount || 0;
  

    const externalCharges =
      breakups.find((x) => x.name === "External Charges")?.amount || 0;

    const taxes = breakups.find((x) => x.name === "Taxes")?.amount || 0;


    return res.json({
      success: true,
      angelOneBrokerage,
      externalCharges,
      taxes,
    });
  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
