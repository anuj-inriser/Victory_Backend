const getPool = require("../db/db.js");
const axios = require("axios");

const fundAndMargin = async (req, res, next) => {
  const pool = getPool();
  try {
    const authHeader = req.headers["authorization"];
    const contentTypeHeader = req.headers["content-type"];
    const acceptHeader = req.headers["accept"];
    const clientLocalIPHeader = req.headers["x-clientlocalip"];
    const clientPublicIPHeader = req.headers["x-clientpublicip"];
    const macAddressHeader = req.headers["x-macaddress"];

    const response = await axios.get(
      "https://apiconnect.angelone.in/rest/secure/angelbroking/user/v1/getRMS",
      {
        headers: {
          Authorization: `Bearer ${authHeader}`,
          "Content-Type": `${contentTypeHeader}`,
          Accept: `${acceptHeader}`,
          "X-UserType": "USER",
          "X-SourceID": "WEB",
          "X-ClientLocalIP": `${clientLocalIPHeader}`,
          "X-ClientPublicIP": `${clientPublicIPHeader}`,
          "X-MACAddress": `${macAddressHeader}`,
          "X-PrivateKey": process.env.API_KEY,
        },
      }
    );
    const responseTimeStamp = new Date();

    const jsonData = {
      ...response.data.data,
      response_timestamp: responseTimeStamp,
    };

    const result = await pool.query(
      "Call fund_and_margin_create($1,null,null,null)",
      [JSON.stringify(jsonData)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    if (out_status) {
      return res.status(201).json({
        status: out_status,
        message: out_message,
        result: out_result,
      });
    } else {
      return res.status(400).json({
        status: out_status,
        message: out_message,
      });
    }
  } catch (error) {
    console.log("error while fetching Fund&Margin", error.message);
    next(error);
  }
};

module.exports = { fundAndMargin };
