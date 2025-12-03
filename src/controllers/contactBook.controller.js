const getPool = require("../db/db.js");

const getContactByContactId = async (req, res, next) => {
  const pool = getPool();
  try {
    let { contactid } = req.params;
    contactid = Number(contactid);


    const result = await pool.query(
      "SELECT * FROM contact_book_get_by_contactid($1)",
      [contactid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Contact not found with this ContactID",
      });
    }

    res.status(200).json({
      message: "Contact fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching contact by ContactID:", error);
    next(error);
  }
};

const getContactByUserId = async (req, res, next) => {
  const pool = getPool();
  try {
    let { userid } = req.params;
    userid = Number(userid);


    const result = await pool.query(
      "SELECT * FROM contact_book_get_by_userid($1)",
      [userid]
    );

    // Get total count from first row (all rows have same total_contacts value)
    const totalContacts =
      result.rows.length > 0 ? result.rows[0].total_contacts : 0;

    res.status(200).json({
      message: "User contacts fetched successfully",
      userId: userid,
      totalContacts: Number(totalContacts),
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching contacts by UserID:", error);
    next(error);
  }
};

const createContact = async (req, res, next) => {
  const pool = getPool();
  try {
    const {
      userid,
      contactname,
      phonenumber,
      email,
      outuserid,
      givenname,
      isblocked,
    } = req.body;

    // ('Creating contact with data:', req.body);

    // Validate required fields
    if (!userid) {
      return res.status(400).json({
        status: false,
        message: "userid is required",
        result: 0,
      });
    }

    // Properly handle the JSON data with correct null checks
    const jsonData = {
      userid: Number(userid),
      contactname: contactname || null,
      phonenumber: phonenumber || null,
      email: email || null,
      outuserid: outuserid ? Number(outuserid) : null, // Only convert if exists
      givenname: givenname || null,
      isblocked: isblocked === true || isblocked === "true" ? true : false,
    };


    const result = await pool.query("CALL contact_book_create($1,$2,$3,$4)", [
      JSON.stringify(jsonData),
      null,
      null,
      null,
    ]);
    const { out_message, out_status, out_result } = result.rows[0];


    if (out_status) {
      return res.status(201).json({
        // Changed to 201 for created
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
    console.error("Error creating contact:", error);
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  const pool = getPool();
  try {
    let { contactid } = req.params;
    contactid = Number(contactid);

    const {
      userid,
      contactname,
      phonenumber,
      email,
      outuserid,
      givenname,
      isblocked,
    } = req.body;


    const jsonData = {
      contactid: contactid,
      userid: userid ? Number(userid) : null,
      contactname: contactname,
      phonenumber: phonenumber,
      email: email,
      outuserid: Number(outuserid),
      givenname: givenname,
      isblocked: isblocked,
    };


    const result = await pool.query(
      "CALL contact_book_update($1,null,null,null)",
      [JSON.stringify(jsonData)]
    );
    const { out_message, out_status, out_result } = result.rows[0];


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
    console.error("Error updating contact:", error);
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  const pool = getPool();
  try {
    let { contactid } = req.params;
    contactid = Number(contactid);

    const result = await pool.query(
      "CALL contact_book_delete($1,null,null,null)",
      [contactid]
    );
    const { out_message, out_status, out_result } = result.rows[0];

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
    console.error("Error deleting contact:", error);
    next(error);
  }
};

module.exports = {
  getContactByContactId,
  getContactByUserId,
  createContact,
  updateContact,
  deleteContact,
};
