const WebSocket = require("ws");
const getPool = require("../db/db.js");
const pool = getPool();

// === 🔑 SmartAPI Credentials ===
const CLIENT_CODE = "NEHR5525";
const FEED_TOKEN =
  "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6Ik5FSFI1NTI1IiwiaWF0IjoxNzYzOTU1NDg4LCJleHAiOjE3NjQwNDE4ODh9.puw9crUjXrB3W-wcgsw22k3R6w-amSAMEwqY0glPn5dj9SRaUpiDVTSpjCrcqa6m8ufb8T7x24d_wh12EfstVw";
const API_KEY = process.env.API_KEY;
const TOKEN_ORDER = ["3045", "13844", "13859"];

// === 📦 Subscription Request ===
const SUBSCRIPTION_REQUEST = {
  correlationID: "abcde12345",
  action: 1,
  params: {
    mode: 3,
    tokenList: [
      {
        exchangeType: 1,
        tokens: TOKEN_ORDER,
      },
    ],
  },
};

let ws;
let reconnectTimer;
let heartbeat;

// === 🚀 Start Stream ===
function startSmartApiStream() {
  const url = `wss://smartapisocket.angelone.in/smart-stream?clientCode=${CLIENT_CODE}&feedToken=${FEED_TOKEN}&apiKey=${API_KEY}`;
  ws = new WebSocket(url);
  ws.binaryType = "arraybuffer";

  ws.on("open", () => {
    ws.send(JSON.stringify(SUBSCRIPTION_REQUEST));
    heartbeat = setInterval(() => ws.send("ping"), 30000);
  });

  ws.on("message", async (data) => {
    if (!(data instanceof Buffer) && !(data instanceof ArrayBuffer)) return;

    const buffer =
      data instanceof Buffer
        ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
        : data;

    const parsed = parseFullPacket(buffer);
    if (parsed) {
      await saveTickToDB(parsed);
    }
  });

  ws.on("close", reconnect);
  ws.on("error", reconnect);
}

// === 🔁 Auto Reconnect ===
function reconnect() {
  if (heartbeat) clearInterval(heartbeat);
  if (!reconnectTimer) {
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      startSmartApiStream();
    }, 5000);
  }
}

// === 🧠 Binary Packet Parser ===
function parseFullPacket(buffer) {
  try {
    const view = new DataView(buffer);
    const totalBytes = buffer.byteLength;
    if (totalBytes < 120) return null;

    const mode = view.getUint8(0);
    const exchangeType = view.getUint8(1);

    let token = "";
    for (let i = 2; i < 27 && i < totalBytes; i++) {
      const char = view.getUint8(i);
      if (char === 0) break;
      token += String.fromCharCode(char);
    }

    const safeBig = (offset) =>
      offset + 8 <= totalBytes ? Number(view.getBigInt64(offset, true)) : 0;
    const safeInt = (offset) =>
      offset + 4 <= totalBytes ? view.getInt32(offset, true) : 0;
    const safeFloat = (offset) =>
      offset + 8 <= totalBytes ? view.getFloat64(offset, true) : 0;

    const ltp = safeInt(43) / 100.0;
    const volume = safeBig(67);
    const totalBuyQty = safeFloat(75);
    const totalSellQty = safeFloat(83);
    const open = safeBig(91) / 100.0;
    const high = safeBig(99) / 100.0;
    const low = safeBig(107) / 100.0;
    const close = safeBig(115) / 100.0;
    const openInterest = safeBig(131);
    const upperCircuit = safeBig(347) / 100.0;
    const lowerCircuit = safeBig(355) / 100.0;
    const weekHigh = safeBig(363) / 100.0;
    const weekLow = safeBig(371) / 100.0;

    // === 🔽 Best 5 Buy/Sell Depth ===
    const bestFiveData = [];
    let offset = 147;
    for (let i = 0; i < 10; i++) {
      if (offset + 20 > totalBytes) break;
      const flag = view.getInt16(offset, true);
      const qty = Number(view.getBigInt64(offset + 2, true));
      const price = Number(view.getBigInt64(offset + 10, true)) / 100.0;
      const orders = view.getInt16(offset + 18, true);
      bestFiveData.push({
        flag,
        side: flag === 1 ? "Buy" : "Sell",
        qty,
        price,
        orders,
        level: i + 1,
      });
      offset += 20;
    }

    return {
      mode,
      exchangeType,
      token,
      ltp,
      open,
      high,
      low,
      close,
      volume,
      totalBuyQty,
      totalSellQty,
      openInterest,
      upperCircuit,
      lowerCircuit,
      weekHigh,
      weekLow,
      bestFiveData,
    };
  } catch (err) {
    console.error("Binary parse error:", err.message);
    return null;
  }
}

// === 💾 Save to Database ===
async function saveTickToDB(data) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const tickInsert = `
      INSERT INTO public.market_ticks
      (token, exchange_type, mode, ltp, open, high, low, close, volume,
       total_buy_qty, total_sell_qty, open_interest, upper_circuit,
       lower_circuit, week_high, week_low)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      RETURNING id
    `;
    const tickValues = [
      data.token,
      data.exchangeType,
      data.mode,
      data.ltp,
      data.open,
      data.high,
      data.low,
      data.close,
      data.volume,
      data.totalBuyQty,
      data.totalSellQty,
      data.openInterest,
      data.upperCircuit,
      data.lowerCircuit,
      data.weekHigh,
      data.weekLow,
    ];

    const res = await client.query(tickInsert, tickValues);
    const tickId = res.rows[0].id;

    // Insert best 5 depth records
    for (const row of data.bestFiveData) {
      await client.query(
        `
        INSERT INTO public.market_depth
        (tick_id, token, side, qty, price, orders, level)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
      `,
        [tickId, data.token, row.side, row.qty, row.price, row.orders, row.level]
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ DB Insert Error:", err.message);
  } finally {
    client.release();
  }
}

// === Export ===
module.exports = { startSmartApiStream };
