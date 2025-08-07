const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);  // Protect all book routes

router.post('/', bookController.createBook);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

module.exports = router;