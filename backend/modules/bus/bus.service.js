/* eslint-disable camelcase */
const pool      = require("../../Config/dbconfig");
const haversine = require("../../util/haversine");

const STOPPAGE_RADIUS_METERS = 120;   // geofence


async function getLiveBusLocations(userBusNo = null) {
    let sql = `
        SELECT
            b.bus_ID,
            b.bus_name,
            b.reg_no,
            b.route,
            b.status                AS bus_status,
            bl.bus_latitude,
            bl.bus_longitude,
            d.driver_name,
            d.driver_phone_no,
            d.status                AS driver_status
        FROM   bus b
                   /* newest point per bus */
                   LEFT JOIN (
            SELECT bl1.*
            FROM   bus_location bl1
                       JOIN  (SELECT bus_ID, MAX(updated_at) AS latest
                              FROM bus_location GROUP BY bus_ID) bl2
                             ON bl1.bus_ID = bl2.bus_ID
                                 AND bl1.updated_at = bl2.latest
        ) bl ON b.bus_ID = bl.bus_ID
                   LEFT JOIN driver d ON b.bus_name = d.bus_no
        WHERE  b.status = 'Active'
    `;

    const params = [];
    if (userBusNo && String(userBusNo).trim()) {
        sql += ` AND LOWER(TRIM(b.bus_name)) = LOWER(TRIM(?))`;
        params.push(userBusNo);
    }
    sql += ` ORDER BY b.bus_name`;

    try {
        const rows = await pool.query(sql, params);
         return rows;
    }
    catch (e) {
        console.error("getLiveBusLocations failed:", e);
        return [];
    }
}

/* ───── Route helpers ───── */
async function getBusRoute(busName) {
    const sql = `
        SELECT route_id,
               stoppage_name,
               stoppage_latitude,
               stoppage_longitude,
               stoppage_number,
               has_arived
        FROM   route
        WHERE  route_name = (
            SELECT route
            FROM   bus
            WHERE  bus_name = ?
            LIMIT  1
            )
        ORDER  BY stoppage_number ASC
    `;

    const rows = await pool.query(sql, [busName]);
    return rows;
                                    //     return pure array
}


async function markStoppageAsArrived(busName) {
    const route = await getBusRoute(busName);
    if (!route.length) return 0;
    const last = route[route.length - 1];
    const { affectedRows } = await pool.query(
        `UPDATE route SET has_arived = 1 WHERE route_id = ?`,
        [last.route_id]
    );
    return affectedRows;
}

async function saveBusLocation(busName, lat, lng) {
    const sql = `
        INSERT INTO bus_location (bus_ID, bus_latitude, bus_longitude)
        VALUES ((SELECT bus_ID FROM bus WHERE bus_name = ? LIMIT 1), ?, ?)
        ON DUPLICATE KEY UPDATE
                             bus_latitude  = VALUES(bus_latitude),
                             bus_longitude = VALUES(bus_longitude),
                             updated_at    = CURRENT_TIMESTAMP();
    `;
    await pool.query(sql, [busName, lat, lng]);
}

async function resetRoute(busName = null) {
    let sql = `UPDATE route SET has_arived = 0`;
    const params = [];
    if (busName) {
        sql += ` WHERE route_name = (SELECT route FROM bus WHERE bus_name = ?)`;
        params.push(busName);
    }
    return (await pool.query(sql, params)).affectedRows;
}

/* ———————————————— Main geofence checker ———————————————— */
async function markNearestStoppage(busName, lat, lng) {
    const latNum = Number(lat);
    const lngNum = Number(lng);
    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) return 0;

    /* fetch the NEXT un‑visited stop only */
    const sql = `
    SELECT route_id, stoppage_latitude, stoppage_longitude
    FROM   route
    WHERE  route_name = (SELECT route FROM bus WHERE bus_name = ? LIMIT 1)
      AND  has_arived = 0
    ORDER  BY stoppage_number ASC
    LIMIT  1
  `;
    const rows = await pool.query(sql, [busName]);   // ✅ array
      if (!rows.length) return 0;
        const stop = rows[0];
    const distM = haversine(
        latNum, lngNum,
        Number(stop.stoppage_latitude),
        Number(stop.stoppage_longitude)
    );

    if (distM > STOPPAGE_RADIUS_METERS) return 0;
    console.log(
        `🛰︎ bus ${busName} → stop ${stop.route_id} distance ${distM.toFixed(1)} m`
    );


    const { affectedRows } = await pool.query(
        `UPDATE route SET has_arived = 1 WHERE route_id = ?`,
        [stop.route_id]
    );
    return affectedRows;          // 1 if success
}

/* ———————————————————————————————————————————————— */
module.exports = {
    getLiveBusLocations,
    getBusRoute,
    markStoppageAsArrived,
    resetRoute,
    saveBusLocation,
    markNearestStoppage
};
