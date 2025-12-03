const getPool = require("../db/db.js");

const getAllNotifications = async (req, res, next) => {
  const pool = getPool();
  try {
    const result = await pool.query("SELECT * FROM notification_getall()");
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in getAllNotifications:", error);
    next(error);
  }
};

const getNotificationById = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Notification ID is required",
        result: null,
      });
    }

    const result = await pool.query("SELECT * FROM notification_getbyid($1)", [
      Number(id),
    ]);
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 404).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in getNotificationById:", error);
    next(error);
  }
};

const createNotification = async (req, res, next) => {
  const pool = getPool();
  try {
    const {
      notificationtypeid,
      usergroupid,
      notificationtext,
      senttime,
      approvedby,
      approvedtime,
    } = req.body;

    // Validate required fields
    if (!notificationtypeid) {
      return res.status(400).json({
        status: false,
        message: "notificationtypeid is required",
        result: 0,
      });
    }

    if (!notificationtext || notificationtext.trim() === "") {
      return res.status(400).json({
        status: false,
        message: "notificationtext is required",
        result: 0,
      });
    }

    const jsonData = {
      notificationtypeid: Number(notificationtypeid),
      usergroupid: usergroupid ? Number(usergroupid) : null,
      notificationtext,
      senttime: senttime || null,
      approvedby: approvedby ? Number(approvedby) : null,
      approvedtime: approvedtime || null,
    };

    const result = await pool.query(
      "CALL notification_create($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 201 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in createNotification:", error);
    next(error);
  }
};

const updateNotification = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;
    const {
      notificationtypeid,
      usergroupid,
      notificationtext,
      approvedby,
      approvedtime,
      isread,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Notification ID is required",
        result: 0,
      });
    }

    const jsonData = {
      notificationid: Number(id),
      notificationtypeid: notificationtypeid
        ? Number(notificationtypeid)
        : null,
      usergroupid: usergroupid ? Number(usergroupid) : null,
      notificationtext: notificationtext || null,
      approvedby: approvedby ? Number(approvedby) : null,
      approvedtime: approvedtime || null,
      isread: isread !== undefined ? Boolean(isread) : null,
    };

    const result = await pool.query(
      "CALL notification_update($1, NULL, NULL, NULL)",
      [JSON.stringify(jsonData)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 400).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in updateNotification:", error);
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  const pool = getPool();
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Notification ID is required",
        result: 0,
      });
    }

    const result = await pool.query(
      "CALL notification_delete($1, NULL, NULL, NULL)",
      [Number(id)]
    );
    const { out_status, out_message, out_result } = result.rows[0];

    return res.status(out_status ? 200 : 404).json({
      status: out_status,
      message: out_message,
      result: out_result,
    });
  } catch (error) {
    console.error("Error in deleteNotification:", error);
    next(error);
  }
};

module.exports = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
};
