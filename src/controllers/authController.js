const getPool = require("../db/db.js");

const logout = async (req, res) => {
    const pool = getPool();

    const { userId, authToken, clientcode } = req.body;

    if (!userId || !authToken || !clientcode) {
        return res.status(400).json({
            status: false,
            message: "userId, authToken, and clientcode are required",
        });
    }

    try {
        const angelResponse = await fetch(
            "https://apiconnect.angelone.in/rest/secure/angelbroking/user/v1/logout",
            {
                method: "POST",
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
                body: JSON.stringify({ clientcode }),
            }
        );

        const angelData = await angelResponse.json();

        if (!angelResponse.ok) {
            console.warn("⚠️ Angel One logout failed:", angelData);
        }

        return res.status(200).json({
            status: true,
            message: "Logged out successfully",
            angelOneLogout: angelResponse.ok,
            data: { userId },
        });
    } catch (error) {
        console.error("❌ Logout error:", error);
        return res.status(500).json({
            status: false,
            message: "Logout failed",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

const checkUserExists = async (req, res, next) => {
    const pool = getPool();
    const { phone } = req.body;

    // Basic validation (you can move this to middleware if needed)
    if (!phone || typeof phone !== 'string') {
        return res.status(400).json({
            status: false,
            message: "Phone number is required and must be a string",
        });
    }
    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE phone = $1",
            [phone]
        );

        const exists = result.rows.length > 0;
        const userId = exists ? result.rows[0].userid : null;

        return res.status(200).json({
            status: true,
            message: "User check completed",
            data: { exists, userId }
        });
    } catch (error) {
        console.error("Error in checkUserExists:", error);
        next(error);
    }
};

module.exports = {
    logout,
    checkUserExists,
};