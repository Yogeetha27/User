const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captcha;
};

let captchaString = '';

// Endpoint to get CAPTCHA
app.get('/captcha', (req, res) => {
    captchaString = generateCaptcha();
    res.json({ captcha: captchaString });
});

// Endpoint to validate CAPTCHA and handle login
app.post('/login', (req, res) => {
    const { employee_code, username, password, captchaInput } = req.body;

    // Check CAPTCHA
    if (captchaInput !== captchaString) {
        return res.status(400).json({ message: 'Invalid CAPTCHA' });
    }

    // Here, perform your actual login validation
    if (username === 'user' && password === 'pass') {
        res.json({ message: 'Login successful!' });
    } else {
        res.status(400).json({ message: 'Invalid username or password' });
    }
});

app.listen(3000, () => {
    console.log('Captcha server is running on port 3000');
});
