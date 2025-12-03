const getPool = require("../db/db.js");

const getAllTexts = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM text_getall()");

    res.status(200).json({
      message: "Texts fetched successfully",
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching texts:", error);
    next(error);
  }
};

const createText = async (req, res, next) => {
  const pool = getPool();
  try {
    const { senderuserid, receiveruserid, contenttype, text, senttime } =
      req.body;


    // Validate required fields
    if (!senderuserid) {
      return res.status(400).json({
        status: false,
        message: "senderuserid is required",
        result: 0,
      });
    }

    if (!receiveruserid) {
      return res.status(400).json({
        status: false,
        message: "receiveruserid is required",
        result: 0,
      });
    }

    const jsonData = {
      senderuserid: Number(senderuserid),
      receiveruserid: Number(receiveruserid),
      contenttype: contenttype || "text",
      text: text || "",
      senttime: senttime || new Date().toISOString(),
    };


    const result = await pool.query("CALL texts_create($1, NULL, NULL, NULL)", [
      JSON.stringify(jsonData),
    ]);
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
        result: out_result,
      });
    }
  } catch (error) {
    console.error("Error creating text:", error);
    next(error);
  }
};

const getTextById = async (req, res, next) => {
  const pool = getPool();
  try {
    let { textid } = req.params;

    if (!textid) {
      return res.status(400).json({
        message: "TextID parameter is missing",
      });
    }

    textid = Number(textid);

    if (isNaN(textid)) {
      return res.status(400).json({
        message: "Invalid TextID - must be a number",
      });
    }


    const result = await pool.query("SELECT * FROM text_getbyid($1)", [textid]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Text not found",
      });
    }

    res.status(200).json({
      message: "Text fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching text by ID:", error);
    next(error);
  }
};

const updateText = async (req, res, next) => {
  const pool = getPool();
  try {
    let { id } = req.params;
    const { text, edittime, deliveredtime, readtime, deletetime } = req.body;


    if (!id) {
      return res.status(400).json({
        message: "TextID parameter is missing",
      });
    }

    id = Number(id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid TextID - must be a number",
      });
    }

    const jsonData = {
      textid: id,
      text: text || null,
      edittime: edittime || null,
      deliveredtime: deliveredtime || null,
      readtime: readtime || null,
      deletetime: deletetime || null,
    };


    const result = await pool.query("CALL texts_update($1,null,null,null)", [
      JSON.stringify(jsonData),
    ]);

    const { out_status, out_message, out_result } = result.rows[0];


    if (out_status) {
      return res.status(200).json({
        status: out_status,
        message: out_message,
        result: out_result,
      });
    } else {
      return res.status(400).json({
        status: out_status,
        message: out_message,
        result: out_result,
      });
    }
  } catch (error) {
    console.error("Error updating text:", error);
    next(error);
  }
};

const deleteText = async (req, res, next) => {
  const pool = getPool();
  try {
    let { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "TextID parameter is missing",
      });
    }

    id = Number(id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid TextID - must be a number",
      });
    }


    const result = await pool.query("CALL texts_delete($1,null,null,null)", [
      id,
    ]);

    const { out_status, out_message, out_result } = result.rows[0];

    if (out_status) {
      return res.status(200).json({
        status: out_status,
        message: out_message,
        result: out_result,
      });
    } else {
      return res.status(400).json({
        status: out_status,
        message: out_message,
        result: out_result,
      });
    }
  } catch (error) {
    console.error("Error deleting text:", error);
    next(error);
  }
};

module.exports = {
  getAllTexts,
  createText,
  getTextById,
  updateText,
  deleteText,
};
