const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    password: "Megha@100",
    host: "localhost",
    port: 5432,
    database: "new1_login_system"
});

// Uncomment the following code to create a new database if needed
// pool.query("CREATE DATABASE new2_login_System;").then(() => {
//     console.log("Database Created");
// }).catch((err) => {
//     console.error("Error creating database:", err);
// });

// Create the employees1 table with the necessary fields
const createTable = `
    CREATE TABLE IF NOT EXISTS employees1 (
        employee_code VARCHAR(50) UNIQUE PRIMARY KEY,
        full_name VARCHAR(100),
        designation VARCHAR(50),
        photograph BYTEA,
        specialty VARCHAR(50),
        username VARCHAR(50) UNIQUE,
        password VARCHAR(255)
    );
`;

pool.query(createTable)
    .then(() => {
        console.log("Table Created");
    })
    .catch((err) => {
        console.error("Error creating table:", err);
    })

module.exports = pool;
