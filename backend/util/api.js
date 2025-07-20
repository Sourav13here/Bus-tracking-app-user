const { getLiveBusLocations } = require("../modules/bus/bus.service");
const db = require("../Config/dbconfig");

const getBusLocations = async (req, res) => {
    try {
        const busNoFromQuery = req.query.busNo?.trim(); // ✅ New
        const phone = req.query.phone?.trim();

        let busNo = null;

        if (busNoFromQuery) {
            busNo = busNoFromQuery;
        } else if (phone && /^\d{10}$/.test(phone)) {
            // fallback only if no busNo passed
            const result = await db.query(
                "SELECT TRIM(bus_name) AS bus_name FROM users WHERE phone_no = ?",
                [phone]
            );

            if (Array.isArray(result) && result.length > 0) {
                const assignedBus = result[0].bus_name;
                if (assignedBus) {
                    busNo = assignedBus.trim();
                }
            }
        }

        const buses = await getLiveBusLocations(busNo); // pass to SQL
        res.json({ success: true, data: Array.isArray(buses) ? buses : [] });
    } catch (error) {
        console.error("Error fetching bus locations:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


module.exports = {
    getBusLocations,
};
