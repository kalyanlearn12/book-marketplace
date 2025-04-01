const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware.authenticate, bookController.upload.single('coverImage'), bookController.createBook);
router.get('/', bookController.getBooks);
router.post('/:id/borrow', authMiddleware.authenticate, bookController.borrowBook);

module.exports = router;