const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const { verifyToken, isAdmin, isStudent } = require('../middleware/auth');

router.get('/', fileController.getAllFiles);
router.get('/my-uploads', verifyToken, isStudent, fileController.getMyUploads);
router.post('/upload', verifyToken, isStudent, fileController.uploadMiddleware, fileController.uploadFile);
router.delete('/:id', verifyToken, isAdmin, fileController.deleteFile);

module.exports = router;
