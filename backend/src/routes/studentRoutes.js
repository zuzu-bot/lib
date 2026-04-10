const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken, isStudent } = require('../middleware/auth');

router.get('/dashboard', verifyToken, isStudent, studentController.getStudentDashboard);
router.get('/my-books', verifyToken, isStudent, studentController.getMyIssuedBooks);
router.get('/history', verifyToken, isStudent, studentController.getPersonalHistory);
router.get('/profile', verifyToken, isStudent, studentController.getProfile);
router.post('/request-issue', verifyToken, isStudent, studentController.requestIssue);
router.post('/change-password', verifyToken, isStudent, studentController.changePassword);
router.put('/profile', verifyToken, isStudent, studentController.updateProfile);

module.exports = router;
