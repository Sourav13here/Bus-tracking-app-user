/* modules/bus/bus.service.js — FIXED markNearestStoppage function */
/* eslint-disable camelcase */
const pool      = require("../../Config/dbconfig");
const haversine = require("../../util/haversine");



const STOPPAGE_RADIUS_METERS = 200;
const DEBUG                  = true;

const log  = (...msg) => { if (DEBUG) console.log("[bus.service]", ...msg); };
const warn = (...msg) => { if (DEBUG) console.warn("[bus.service]", ...msg); };


async function getLiveBusLocations(userBusNo = null) {
    let sql = `
        SELECT
            b.bus_ID, b.bus_name, b.reg_no, b.route,
            b.status                     AS bus_status,
            bl.bus_latitude, bl.bus_longitude,
            d.driver_name,  d.driver_phone_no,
            d.status                     AS driver_status
        FROM   bus b
                   /* newest point per bus */
                   LEFT JOIN (
            SELECT bl1.*
            FROM   bus_location bl1
                       JOIN (SELECT bus_name, MAX(updated_at) AS latest
                             FROM bus_location GROUP BY bus_name) bl2
                            ON bl1.bus_name     = bl2.bus_name
                                AND bl1.updated_at = bl2.latest
        ) bl ON b.bus_name = bl.bus_name
                   LEFT JOIN driver d ON b.bus_name = d.bus_name
        WHERE  b.status = 'Active'
    `;

    const params = [];
    if (userBusNo && String(userBusNo).trim()) {
        sql += ` AND LOWER(TRIM(b.bus_name)) = LOWER(TRIM(?))`;
        params.push(userBusNo);
    }
    sql += " ORDER BY b.bus_name";

    try {
        return await pool.query(sql, params);
    } catch (e) {
        warn("getLiveBusLocations failed:", e);
        return [];
    }
}

async function getBusRoute(busName) {
    const sql = `
        SELECT route_id, stoppage_name,
               stoppage_latitude, stoppage_longitude,
               stoppage_number,  has_arived
        FROM   route
        WHERE  route_name = (
            SELECT route FROM bus
            WHERE  bus_name = ? LIMIT 1
            )
        ORDER BY stoppage_number ASC
    `;
    return pool.query(sql, [busName]);
}

async function markStoppageAsArrived(busName) {
    const route = await getBusRoute(busName);
    if (!route.length) return 0;

    const last             = route[route.length - 1];
    const { affectedRows } = await pool.query(
        `UPDATE route SET has_arived = 1 WHERE route_id = ?`,
        [last.route_id]
    );
    log(`Completed entire route for ${busName} (last stop ${last.route_id})`);
    return affectedRows;
}

async function saveBusLocation(busName, lat, lng) {

    const sql = `
        INSERT INTO bus_location (bus_name, bus_latitude, bus_longitude)
        VALUES (
                       (SELECT bus_ID FROM bus WHERE bus_name = ? LIMIT 1),
            ?, ?
            )
        ON DUPLICATE KEY UPDATE
                             bus_latitude  = VALUES(bus_latitude),
                             bus_longitude = VALUES(bus_longitude),
                             updated_at    = CURRENT_TIMESTAMP()
    `;
    await pool.query(sql, [busName, lat, lng]);
}

/* Resets either a single bus's route or all routes */
async function resetRoute(busName = null) {
    let   sql    = "UPDATE route SET has_arived = 0";
    const params = [];
    if (busName) {
        sql += ` WHERE route_name = (
                    SELECT route FROM bus WHERE bus_name = ?
                 )`;
        params.push(busName);
    }
    const { affectedRows } = await pool.query(sql, params);
    log(`♻️  resetRoute → ${affectedRows} rows`);
    return affectedRows;
}

async function markNearestStoppage(busName, lat, lng) {
    const latNum = Number(lat);
    const lngNum = Number(lng);
    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
        warn("markNearestStoppage: bad numbers", lat, lng);
        return 0;
    }

    // Get ALL unvisited stops (not just the next one)
    const sql = `
        SELECT route_id, stoppage_name, stoppage_latitude, stoppage_longitude, stoppage_number
        FROM   route
        WHERE  route_name = (
            SELECT route FROM bus WHERE bus_name = ? LIMIT 1
            )
          AND has_arived = 0
        ORDER BY stoppage_number ASC
    `;

    const rows = await pool.query(sql, [busName]);
    if (!rows.length) {
        log(`No unvisited stops left for ${busName}`);
        return 0;
    }

    log(`🚍 ${busName} at (${latNum}, ${lngNum}) checking ${rows.length} unvisited stops`);

    // Check distance to ALL unvisited stops, find the closest one within radius
    let closestStop = null;
    let minDistance = Infinity;

    for (const stop of rows) {
        const distM = haversine(
            latNum, lngNum,
            Number(stop.stoppage_latitude),
            Number(stop.stoppage_longitude)
        );

        log(`  → Stop #${stop.stoppage_number} "${stop.stoppage_name}" = ${distM.toFixed(1)}m`);

        if (distM < STOPPAGE_RADIUS_METERS && distM < minDistance) {
            minDistance = distM;
            closestStop = stop;
        }
    }

    if (!closestStop) {
        log(`❌ No stops within ${STOPPAGE_RADIUS_METERS}m radius`);
        return 0;
    }

    const { affectedRows } = await pool.query(
        `UPDATE route SET has_arived = 1 WHERE route_id = ?`,
        [closestStop.route_id]
    );

    if (affectedRows) {
        log(`✅ Marked stop #${closestStop.stoppage_number} "${closestStop.stoppage_name}" as visited (${minDistance.toFixed(1)}m away)`);
    } else {
        warn(`⚠️ Tried to update stop ${closestStop.route_id} but nothing changed`);
    }

    return affectedRows;
}
module.exports = {
    getLiveBusLocations,
    getBusRoute,
    markStoppageAsArrived,
    resetRoute,
    saveBusLocation,
    markNearestStoppage,
};