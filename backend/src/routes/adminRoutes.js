const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/students', verifyToken, isAdmin, adminController.getAllStudents);
router.put('/students/:id', verifyToken, isAdmin, adminController.updateStudent);
router.delete('/students/:id', verifyToken, isAdmin, adminController.deleteStudent);
router.get('/stats', verifyToken, isAdmin, adminController.getDashboardStats);
router.get('/reports/fines', verifyToken, isAdmin, adminController.getFineReports);

module.exports = router;
