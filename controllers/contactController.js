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
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error"});
    }
}
