const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const db = require('../config/database');

// Add a new book
router.post('/',
    auth,
    [
        body('name').notEmpty(),
        body('price').isFloat({ min: 0 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, price } = req.body;

            const [result] = await db.execute(
                'INSERT INTO books (name, price) VALUES (?, ?)',
                [name, price]
            );

            res.status(201).json({
                message: 'Book added successfully',
                bookId: result.insertId
            });
        } catch (error) {
            res.status(500).json({ message: 'Error adding book' });
        }
    }
);

// Get all books
router.get('/', auth, async (req, res) => {
    try {
        const [books] = await db.execute('SELECT * FROM books');
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books' });
    }
});

module.exports = router;