const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { verifyToken, isStudent } = require('../middleware/auth');

router.get('/books/:id/comments', communityController.getBookComments);
router.post('/books/:id/comments', verifyToken, isStudent, communityController.addBookComment);

router.get('/files/:id/comments', communityController.getFileComments);
router.post('/files/:id/comments', verifyToken, isStudent, communityController.addFileComment);

module.exports = router;
