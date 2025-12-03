const getPool = require("../db/db.js");
const axios = require("axios");

const placeOrder = async (req, res, next) => {
  const pool = getPool();
  try {
    const {
      variety,
      broker,
      tradingsymbol,
      symboltoken,
      transactiontype,
      exchange,
      ordertype,
      producttype,
      duration,
      price,
      squareoff,
      stoploss,
      quantity,
    } = req.body;

    const authHeader = req.headers["authorization"];
    const contentTypeHeader = req.headers["content-type"];
    const acceptHeader = req.headers["accept"];
    const clientLocalIPHeader = req.headers["x-clientlocalip"];
    const clientPublicIPHeader = req.headers["x-clientpublicip"];
    const macAddressHeader = req.headers["x-macaddress"];

    payload = {
      variety: variety,
      broker: broker,
      tradingsymbol: tradingsymbol,
      symboltoken: symboltoken,
      transactiontype: transactiontype,
      exchange: exchange,
      ordertype: ordertype,
      producttype: producttype,
      duration: duration,
      price: price,
      squareoff: squareoff,
      stoploss: stoploss,
      quantity: quantity,
    };


    const response = await axios.post(
      "https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/placeOrder",
      payload,
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
      ...payload,
      internal_type: "PLACE_ORDER",
      response_timestamp: responseTimeStamp,
      status: response.data.status,
      message: response.data.message,
      errorcode: response.data.errorcode,
      script: response.data.data.script,
      orderid: response.data.data.orderid,
      uniqueorderid: response.data.data.uniqueorderid,
    };

    const result = await pool.query(
      "CALL transactions.orders_transactions_create($1, $2, $3, $4)",
      [JSON.stringify(jsonData), null, null, null]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    if (out_status) {
      res.status(200).json({
        status: out_status,
        message: out_message,
        result: JSON.parse(out_result),
      });
    } else {
      res.status(400).json({
        status: out_status,
        message: out_message,
      });
    }
  } catch (error) {
    console.log("error in place order controller", error);
    next(error);
  }
};

module.exports = { placeOrder };
