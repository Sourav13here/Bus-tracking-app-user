const db = require("../../config/dbconfig");
const otpHelper = require("../../util/otp");

// Generate and save OTP
async function login(phone_no) {
    if (!phone_no) {
        throw new Error("Phone number is required");
    }

    const row = await db.query(
        "SELECT * FROM users WHERE phone_no = ?",
        [phone_no]
    );

    console.log("Existing row:", row);

    const otp = otpHelper.generateOtp();

    if (row.length > 0) {
        const updateResult = await db.query(
            "UPDATE users SET otp = ?, otp_created_at = CURRENT_TIMESTAMP WHERE phone_no = ?",
            [otp, phone_no]
        );
        console.log("Update result:", updateResult);
    } else {
        const insertResult = await db.query(
            "INSERT INTO users (phone_no, otp) VALUES (?, ?)",
            [phone_no, otp]
        );
        console.log("Insert result:", insertResult);
    }

    console.log(`OTP for ${phone_no}: ${otp}`);
    return {otp};
}


// Verify OTP
async function verifyOtp(phone_no, otp) {
    if (!phone_no || !otp) {
        throw new Error("Phone number and OTP are required.");
    }

    const rows = await db.query(
        "SELECT otp, otp_created_at FROM users WHERE phone_no = ?",
        [phone_no]
    );

    console.log("DB rows:", rows);

    if (rows.length === 0) {
        console.log("No user found.");
        return false;
    }

    const record = rows[0];

    console.log("DB record:", record);

    if (String(record.otp) !== String(otp)) {
        console.log(`OTP mismatch: expected=${record.otp}, got=${otp}`);
        return {success: false, message: "Invalid OTP."};
    }

    const createdAt = new Date(record.otp_created_at);
    const now = new Date();
    const diffMs = now - createdAt;
    const diffMins = diffMs / (1000 * 60);

    console.log(`OTP age in minutes: ${diffMins}`);

    if (diffMins > 5) {
        console.log("OTP expired.");
        return {success: false, message: "OTP expired."};
    }

    await db.query(
        "UPDATE users SET otp = NULL, otp_created_at = NULL WHERE phone_no = ?",
        [phone_no]
    );

    console.log("OTP verified successfully.");
    const profileRows = await db.query(
        "SELECT user_name, user_address FROM users WHERE phone_no = ?",
        [phone_no]
    );

    let hasProfile = false;
    if (profileRows.length > 0) {
        const profile = profileRows[0];
        if (profile.user_name && profile.user_address) {
            hasProfile = true;
        }
    }


    return {success: true, hasProfile: hasProfile};
}

module.exports = {
    login,
    verifyOtp
};
