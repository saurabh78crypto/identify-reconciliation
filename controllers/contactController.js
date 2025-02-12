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

        let primaryContact = null;
        let primaryContactId = null;
        let secondaryContacts = [];
        let emails = new Set();
        let phoneNumbers = new Set();

        if (contacts.length > 0) {
            // Identify primary contact
            primaryContact = contacts.find(c => c.linkPrecedence === "primary") || contacts[0];
            primaryContactId = primaryContact.id;

            contacts.forEach(contact => {
                if (contact.email) emails.add(contact.email);
                if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);

                if (contact.id !== primaryContactId) {
                    secondaryContacts.push(contact.id);
                }
            });

            // If the provided email or phone is not already present, create a new secondary contact
            const isNewContact = !contacts.some(c => c.email === email && c.phoneNumber === phoneNumber);
            if (isNewContact) {
                const [newContact] = await db.query(
                    `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence) VALUES (?, ?, ?, ?)`,
                    [email, phoneNumber, primaryContactId, "secondary"]
                );

                secondaryContacts.push(newContact.insertId);
                if (email) emails.add(email);
                if (phoneNumber) phoneNumbers.add(phoneNumber);
            }
        } else {
            // No existing contact found, create a new primary contact
            const [newContact] = await db.query(
                `INSERT INTO Contact (email, phoneNumber, linkPrecedence) VALUES (?, ?, ?)`,
                [email, phoneNumber, "primary"]
            );

            primaryContactId = newContact.insertId;
            if (email) emails.add(email);
            if (phoneNumber) phoneNumbers.add(phoneNumber);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error"});
    }
}
