const getPool = require("../db/db.js");
const axios = require("axios");

const modifyeOrder = async (req, res, next) => {
  const pool = getPool();
  try {
    const {
      variety,
      internal_order_id,
      tradingsymbol,
      symboltoken,
      exchange,
      ordertype,
      producttype,
      duration,
      price,
      quantity,
    } = req.body;

    const authHeader = req.headers["authorization"];
    const contentTypeHeader = req.headers["content-type"];
    const acceptHeader = req.headers["accept"];
    const clientLocalIPHeader = req.headers["x-clientlocalip"];
    const clientPublicIPHeader = req.headers["x-clientpublicip"];
    const macAddressHeader = req.headers["x-macaddress"];

    const remainingData = await pool.query(
      "select broker,transactiontype,squareoff,stoploss,orderid from transactions.orders_transactions where internal_order_id=$1",
      [internal_order_id]
    );

    payload = {
      variety,
      orderid: remainingData.rows[0].orderid,
      tradingsymbol,
      symboltoken,
      exchange,
      ordertype,
      producttype,
      duration,
      price,
      quantity,
    };

    const response = await axios.post(
      "https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/modifyOrder",
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
      internal_type: "MODIFY_ORDER",
      response_timestamp: responseTimeStamp,
      broker: remainingData.rows[0].broker,
      transactiontype: remainingData.rows[0].transactiontype,
      squareoff: remainingData.rows[0].squareoff,
      stoploss: remainingData.rows[0].stoploss,
      status: response.data.status,
      message: response.data.message,
      errorcode: response.data.errorcode,
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
    console.log("error in modify order controller", error);
    next(error);
  }
};

module.exports = { modifyeOrder };
