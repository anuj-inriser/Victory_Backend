const axios = require("axios");

// 🔒 Config values (you can move these to .env)
const ANGEL_BASE = "https://apiconnect.angelone.in";
const CLIENT_LOCAL_IP = "192.168.1.101";
const CLIENT_PUBLIC_IP = "103.55.41.12";
const MAC_ADDRESS = "10-02-B5-43-0E-B8";
const PRIVATE_KEY = process.env.API_KEY;

// 🔑 Permanent backend-side token (auto used — no auth required from client)
// const AUTH_TOKEN =
//   "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6Ik5FSFI1NTI1Iiwicm9sZXMiOjAsInVzZXJ0eXBlIjoiVVNFUiIsInRva2VuIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjFjMlZ5WDNSNWNHVWlPaUpqYkdsbGJuUWlMQ0owYjJ0bGJsOTBlWEJsSWpvaWRISmhaR1ZmWVdOalpYTnpYM1J2YTJWdUlpd2laMjFmYVdRaU9qUXNJbk52ZFhKalpTSTZJak1pTENKa1pYWnBZMlZmYVdRaU9pSTBNelJsTjJZME1TMDRabVV5TFRNd01qQXRZamhtTmkwNU9HSmtOVFV6T0RjMk16SWlMQ0pyYVdRaU9pSjBjbUZrWlY5clpYbGZkaklpTENKdmJXNWxiV0Z1WVdkbGNtbGtJam8wTENKd2NtOWtkV04wY3lJNmV5SmtaVzFoZENJNmV5SnpkR0YwZFhNaU9pSmhZM1JwZG1VaWZTd2liV1lpT25zaWMzUmhkSFZ6SWpvaVlXTjBhWFpsSW4xOUxDSnBjM01pT2lKMGNtRmtaVjlzYjJkcGJsOXpaWEoyYVdObElpd2ljM1ZpSWpvaVRrVklValUxTWpVaUxDSmxlSEFpT2pFM05qUXdOREU0T0Rnc0ltNWlaaUk2TVRjMk16azFOVE13T0N3aWFXRjBJam94TnpZek9UVTFNekE0TENKcWRHa2lPaUpoWlRkaE1tWmxOeTB4WTJOa0xUUTVabUl0WVdNMFlTMDNOemM1WTJVME9UTmxOR1lpTENKVWIydGxiaUk2SWlKOS54bFpnZzk3X1k4dWw4Xy00bXBGRDBZM2JVZ28zS3BNOWNaNnJXMjdJQ1RYUWhLcU9jMWw5dnpydHB2QkxLcy13NjZoQUE3QVpWYXhFN0JNb09TWF92Wm8zRUo2V3hDaGFsNkQ2UG05eXlBdTYxMkMzc01OVHZaeWY3aC16Mm4xbnJRM1VhbC1aeENpXzBjMG5JV3hrT19zankwYWllcGlCX05uQXJqbWV2b3MiLCJBUEktS0VZIjoiNnFOcVVaaUoiLCJYLU9MRC1BUEktS0VZIjp0cnVlLCJpYXQiOjE3NjM5NTU0ODgsImV4cCI6MTc2NDAwOTAwMH0.TSA7kerZUq3QTdltXFnhTPOmHje9_By0tJNtiywFB7GKpXI0m992pK3oSI8iunolOxuhsiCdLE6A7KJZDD5z4A";

// ---------------------------
// 🎯 BUY SHARE CREATE (POST)
// ---------------------------
exports.createOrder = async (req, res) => {
  try {
    const {
      price,
      quantity,
      target,
      stoploss,
      exchange,
      symbol,
      variety,
      ordertype,
      segmentType,
      symboltoken,
    } = req.body;

    // ✅ Always use backend-stored auth token
    const authToken = AUTH_TOKEN;

    // Build JSON body
    const body = {
      variety,
      tradingsymbol: symbol,
      symboltoken,
      transactiontype: "BUY",
      exchange,
      ordertype,
      producttype: segmentType,
      duration: "DAY",
      price,
      squareoff: "0",
      stoploss,
      quantity,
    };

    const response = await axios.post(
      `${ANGEL_BASE}/rest/secure/angelbroking/order/v1/placeOrder`,
      body,
      {
        headers: {
          "X-UserType": "USER",
          "X-SourceID": "WEB",
          Authorization: `Bearer ${authToken}`,
          "X-ClientLocalIP": CLIENT_LOCAL_IP,
          "X-ClientPublicIP": CLIENT_PUBLIC_IP,
          "X-MACAddress": MAC_ADDRESS,
          "X-PrivateKey": PRIVATE_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (err) {
    console.error("❌ Error placing order:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Error placing order",
      error: err.response?.data || err.message,
    });
  }
};

// ---------------------------
// 🔍 SEARCH SYMBOL (GET)
// ---------------------------
exports.searchSymbol = async (req, res) => {
  try {
    const { symbol, exchange } = req.query;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json({ success: false, message: "Auth token missing" });
    }

    const authToken = authHeader.replace("Bearer ", "").trim();

    // 1️⃣ Search scrip
    const searchBody = { exchange, searchscrip: symbol };

    const searchResp = await axios.post(
      `${ANGEL_BASE}/rest/secure/angelbroking/order/v1/searchScrip`,
      searchBody,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "X-UserType": "USER",
          "X-SourceID": "WEB",
          "X-ClientLocalIP": CLIENT_LOCAL_IP,
          "X-ClientPublicIP": CLIENT_PUBLIC_IP,
          "X-MACAddress": MAC_ADDRESS,
          "X-PrivateKey": PRIVATE_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const dataList = searchResp.data?.data || [];
    const first = dataList[0];
    if (!first)
      return res.status(404).json({ success: false, message: "Symbol not found" });

    // 2️⃣ Get LTP Data
    const ltpBody = {
      exchange: first.exchange,
      tradingsymbol: first.tradingsymbol,
      symboltoken: first.symboltoken,
    };

    const ltpResp = await axios.post(
      `${ANGEL_BASE}/order-service/rest/secure/angelbroking/order/v1/getLtpData`,
      ltpBody,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "X-UserType": "USER",
          "X-SourceID": "WEB",
          "X-ClientLocalIP": CLIENT_LOCAL_IP,
          "X-ClientPublicIP": CLIENT_PUBLIC_IP,
          "X-MACAddress": MAC_ADDRESS,
          "X-PrivateKey": PRIVATE_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const result = ltpResp.data;

    res.json({
      success: result?.status === true,
      message: result?.message || "OK",
      exchange: result?.data?.exchange || "",
      tradingsymbol: result?.data?.tradingsymbol || "",
      symboltoken: result?.data?.symboltoken || "",
      open: result?.data?.open || 0,
      high: result?.data?.high || 0,
      low: result?.data?.low || 0,
      close: result?.data?.close || 0,
      ltp: result?.data?.ltp || 0,
    });
  } catch (err) {
    // console.error("❌ Search error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Error fetching script data",
      error: err.response?.data || err.message,
    });
  }
};
