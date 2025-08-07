const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

// Register user
router.post('/register',
    [
        body('username').isLength({ min: 3 }),
        body('password').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { username, password } = req.body;
            
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Insert user
            const [result] = await db.execute(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                [username, hashedPassword]
            );

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Username already exists' });
            }
            res.status(500).json({ message: 'Error registering user' });
        }
    }
);

// Login user
router.post('/login',
    [
        body('username').exists(),
        body('password').exists()
    ],
    async (req, res) => {
        try {
            const { username, password } = req.body;

            // Get user
            const [users] = await db.execute(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );

            if (users.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const user = users[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Create token
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in' });
        }
    }
);

module.exports = router;