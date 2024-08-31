const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const pool = require('./database');  // Assuming you have a 'database.js' for the pool setup
require('dotenv').config();

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// CAPTCHA generation logic
const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captcha;
};

let captchaString = '';

// Endpoint to generate a new CAPTCHA
app.get('/captcha', (req, res) => {
    captchaString = generateCaptcha();
    res.json({ captcha: captchaString });
});

// User registration endpoint
app.post('/register', upload.single('photograph'), async (req, res) => {
    const { employee_code, full_name, designation, specialty, username, password, captchaInput } = req.body;
    const photograph = req.file ? req.file.buffer : null;

    try {
        if (captchaInput !== captchaString) {
            return res.status(400).json({ message: 'Captcha verification failed. Please try again.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO employees1(employee_code, full_name, designation, photograph, specialty, username, password)
            VALUES ($1, $2, $3, $4, $5, $6, $7);
        `;

        await pool.query(query, [
            employee_code, full_name, designation, photograph, specialty, username, hashedPassword
        ]);

        res.status(201).send("User registered successfully.");
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).send("Error registering user.");
    }
});

// User login endpoint
app.post('/login', async (req, res) => {
    const { employee_code, username, password } = req.body;

    try {
        const query = `SELECT * FROM employees1 WHERE employee_code = $1 AND username = $2;`;
        const { rows } = await pool.query(query, [employee_code, username]);

        if (rows.length === 0) {
            return res.status(400).send('Wrong details.');
        }

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).send('Wrong details.');
        }

        res.status(200).send('Login successful.');
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).send("Error logging in.");
    }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
const path = require('path');

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
