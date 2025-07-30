const express = require("express");
const router = express.Router();
const loginService = require("../modules/auth/login.service");
const { getBusLocations } = require("../util/api");
const busService = require("../modules/bus/bus.service");
const haversine = require("../util/haversine");
const profileService = require("../modules/profile/profile.service");


router.post("/request-otp", async (req, res) => {
    try {
        console.log("RAW body:", req.body);

        const phone_no_raw = req.body.phone_no || req.body.phone || "";
        const phone_no = String(phone_no_raw).trim();

        console.log("Parsed phone_no:", phone_no);

        if (!phone_no) {
            return res.status(400).json({ success: false, message: "Phone number is required." });
        }

        if (!/^\d{10}$/.test(phone_no)) {
            return res.status(400).json({ success: false, message: "Invalid phone number format." });
        }

        await loginService.login(phone_no);

        res.json({ success: true, message: "OTP sent successfully." });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server error." });
    }
  });

router.post("/verify-otp", async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ success: false, message: "Phone and OTP are required." });
    }

    try {
        const result = await loginService.verifyOtp(phone, otp);

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message || "Invalid or expired OTP." });
        }

        // OTP verified — send hasProfile to client
        res.json({
            success: true,
            message: "OTP verified successfully.",
            hasProfile: result.hasProfile
        });
    } catch (err) {
        console.error("Verify OTP error:", err);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

router.post("/complete-profile", async (req, res) => {
    const { phone, children ,bus_no} = req.body;

    if (!phone || !children || !children.length) {
        return res.status(400).json({
            success: false,
            message: "At least one child is required."
        });
    }

    for (const child of children) {
        if (
            !child.name ||
            !child.address ||
            !child.classValue ||
            !child.section ||
            !child.rollNo
        ) {
            return res.status(400).json({
                success: false,
                message: "Each child must have name, address, class/department, section/semester, and roll number."
            });
        }

        const fields = [child.name, child.address, child.classValue, child.section, child.rollNo];
        if (fields.some(field => field.includes(","))) {
            return res.status(400).json({
                success: false,
                message: "Fields cannot contain commas."
            });
        }
    }

    const names = children.map(c => c.name).join(",");
    const addresses = children.map(c => c.address).join(",");
    const classes = children.map(c => c.classValue).join(",");
    const sections = children.map(c => c.section).join(",");
    const selected_type = children.map((c) => c.selectedType).join(",");
    const rollNos = children.map(c => c.rollNo).join(",");

    try {
        const result = await profileService.updateUserProfile({
            phone,
            user_name: names,
            user_address: addresses,
            class_or_semester: classes,
            selected_type:selected_type,
            section_or_branch: sections,
            roll_no: rollNos,
            bus_no:bus_no|| null
        });

        if (result.affectedRows > 0) {
            return res.json({
                success: true,
                message: "Profile updated successfully."
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
});

router.get("/profile", async (req, res) => {
    const phone = req.query.phone;

    if (!phone) {
        return res.status(400).json({
            success: false,
            message: "Phone number is required."
        });
    }

    try {
        const profile = await profileService.getUserProfile(phone);
        console.log("Fetched profile:", profile);
        return res.json({
            success: true,
            user: profile
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error."
        });
    }
});
router.get("/bus-locations", (req, res, next) => {
    next();
}, getBusLocations);

router.get("/bus-route", async (req, res) => {
    try {
        const { busName } = req.query;
        if (!busName) {
            return res.status(400).json({ error: "busName is required" });
        }

        const route = await busService.getBusRoute(busName);
        return res.json({ route });
    } catch (error) {
        console.error("Error in /bus-route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Sample school coordinates (adjust if different)
const SCHOOL_LAT = 26.179404;
const SCHOOL_LNG = 91.734876;

/* POST  /api/update-location
 * Body: { bus_no, latitude, longitude }
 */
router.post("/update-location", async (req, res) => {
    try {
        const { latitude, longitude, bus_name } = req.body || {};
        if (!latitude || !longitude || !bus_name) {
            return res.status(400).json({ success:false, message:"Missing params" });
        }

        /* always work with numbers */
        const latNum = Number(latitude);
        const lonNum = Number(longitude);

        await busService.saveBusLocation(bus_name, latNum, lonNum);

        const visited = await busService.markNearestStoppage(bus_name, latNum, lonNum);

        const route  = await busService.getBusRoute(bus_name);
        const pending  = route.filter(r => r.has_arrived === 0);
        let   arrived  = false;
        if (!pending.length) {
            await busService.markStoppageAsArrived(bus_name);
            arrived = true;
        }

        const distSchool = haversine(latNum, lonNum, 26.179404, 91.734876);
        if (distSchool < 100) {
            await busService.resetRoute(bus_name);
        }

        res.json({
            success : true,
            visited ,
            arrived ,
            message : arrived
                ? "Bus completed all stoppages."
                : visited
                    ? "Stoppage marked as visited."
                    : "Location updated."
        });
    } catch (err) {
        console.error("update-location failed:", err);
        if (err.sqlMessage) console.error("SQL error:", err.sqlMessage);

        res.status(500).json({ success:false, message:"Server error" });
    }
});










module.exports = router;
