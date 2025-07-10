const db = require("../../Config/dbconfig");

exports.updateUserProfile = async ({
                                       phone,
                                       user_name,
                                       user_address,
                                       selected_type,
                                       class_or_semester,
                                       section_or_branch,
                                       roll_no,
                                       bus_no
                                   }) => {
    const result = await db.query(
        `UPDATE users SET
                          user_name = ?,
                          user_address = ?,
                          class_or_semester = ?,
                          section_or_branch = ?,
                          selected_type =?,
                          roll_no = ?,
                          bus_no=?,
                          created_by = ?,
                          updated_at = NOW()
         WHERE phone_no = ?`,
        [
            user_name,
            user_address,
            class_or_semester,
            section_or_branch,
            selected_type,
            roll_no,
            bus_no,
            user_name, // created_by = user_name
            phone
        ]
    );

    if (Array.isArray(result)) {
        // mysql2/promise
        return result[0];
    } else if (result && result.affectedRows !== undefined) {
        return result;
    } else {
        throw new Error('Unexpected result format: ' + JSON.stringify(result));
    }
};

exports.getUserProfile = async (phone) => {
    if (!phone) {
        throw new Error("Phone number is required.");
    }

    const rows = await db.query(
        `SELECT 
      user_ID,
      phone_no AS phone,
      user_name,
      user_address,
      selected_type,
      class_or_semester,
      section_or_branch,
      roll_no,
      bus_no
    FROM users
    WHERE phone_no = ?`,
        [phone]
    );

    console.log("Query result:", rows);

    if (!rows || rows.length === 0) {
        throw new Error("User not found.");
    }
    console.log("Rows length:", rows.length);


    if (rows.length === 0) {
        throw new Error("User not found.");
    }

    const row = rows[0];
    console.log("Selected row:", row);


    // Split the comma-separated fields
    const names = row.user_name ? row.user_name.split(",") : [];
    const addresses = row.user_address ? row.user_address.split(",") : [];
    const classes = row.class_or_semester ? row.class_or_semester.split(",") : [];
    const sections = row.section_or_branch ? row.section_or_branch.split(",") : [];
    const rollNos = row.roll_no ? row.roll_no.split(",") : [];
    const selectedTypes = row.selected_type ? row.selected_type.split(",") : [];


    const children = names.map((name, index) => ({
        id: index.toString(),
        fullName: name,
        address: addresses[index] || "",
        selectedType: selectedTypes[index] || "School",
        class: classes[index] || "",
        section: sections[index] || "",
        roll_no: rollNos[index] || ""
    }));

    return {
        user_ID: row.user_ID,
        phone: row.phone,
        bus_no: row.bus_no,
        children
    };
};


