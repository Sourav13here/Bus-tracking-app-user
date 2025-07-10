const pool = require("../../Config/dbconfig");

async function getLiveBusLocations(userBusNo = null) {
    let query = `
        SELECT
            b.bus_ID,
            b.bus_name,
            b.reg_no,
            b.route,
            b.status AS bus_status,
            bl.bus_latitude,
            bl.bus_longitude,
            d.driver_name,
            d.driver_phone_no,
            d.status AS driver_status
        FROM bus b
                 LEFT JOIN bus_location bl ON b.bus_ID = bl.bus_ID
                 LEFT JOIN driver d ON b.bus_name = d.bus_no
        WHERE b.status = 'Active'
    `;

    const queryParams = [];

    if (userBusNo && typeof userBusNo === "string" && userBusNo.trim() !== "" && userBusNo.toLowerCase() !== "null" && userBusNo.toLowerCase() !== "undefined") {
        query += ` AND LOWER(TRIM(b.bus_name)) = LOWER(TRIM(?))`;
        queryParams.push(userBusNo);
    }

    query += ` ORDER BY b.bus_name`;

    try {
        console.log("Executing SQL Query:", query);
        console.log("With Params:", queryParams);
        const rows = await pool.query(query, queryParams);
        return Array.isArray(rows) ? rows : [];
    } catch (error) {
        console.error("Database query failed:", error);
        return [];
    }
}

module.exports = {
    getLiveBusLocations
};
