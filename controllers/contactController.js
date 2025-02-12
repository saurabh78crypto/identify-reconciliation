import db from "../config/db.js";

// Identify and consolidate contact information
export const identifyContact = async (req, res) => {
    const { email, phoneNumber } = req.body;

    if(!email && !phoneNumber) {
        return res.status(400).json({ error: "Either email or phone number is required"});
    }

    try {
        // Find existing contact by email or phoneNumber
        const [contacts] = await db.query(
            `SELECT * FROM Contact WHERE email = ? OR phoneNumber = ?`,
            [email, phoneNumber]
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error"});
    }
}
