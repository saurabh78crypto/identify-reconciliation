# Identity Reconciliation 

This is a simple Node.js and Express-based API that identifies and consolidates contact information from a MySQL database.

## Features
- Identifies primary and secondary contacts based on provided email or phone number.
- Stores contact relationships in a MySQL database.
- Creates new contacts when necessary.
- Returns consolidated contact details in a structured JSON response.

## Technologies Used
- Node.js
- Express.js
- MySQL (`mysql2` package)
- dotenv
- body-parser
- CORS

## Project Setup

### Prerequisites
Ensure you have the following installed:
- Node.js (v16+ recommended)
- MySQL Server

### Installation

1. Clone the repository:
```bash
git clone
cd
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory and configure the following:
```ini
PORT=5000
DB_HOST=localhost
DB_USER=yourusername
DB_PASSWORD=yourpassword
DB_NAME=bitespeed_db
```

4. Set up the database:
```sql
CREATE DATABASE bitespeed_db;
USE bitespeed_db;
CREATE TABLE Contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NULL,
    phoneNumber VARCHAR(20) NULL,
    linkedId INT NULL,
    linkPrecedence ENUM('primary', 'secondary') NOT NULL DEFAULT 'primary',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Running the Project

Start the server:
```bash
npm start
```
The server will run on http://localhost:5000.
