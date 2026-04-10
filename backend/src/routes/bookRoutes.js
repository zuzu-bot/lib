const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', bookController.getAllBooks);
router.get('/categories', bookController.getCategories);
router.post('/categories', verifyToken, isAdmin, bookController.addCategory);
router.post('/', verifyToken, isAdmin, bookController.addBook);
router.put('/:id', verifyToken, isAdmin, bookController.updateBook);
router.delete('/:id', verifyToken, isAdmin, bookController.deleteBook);

module.exports = router;
