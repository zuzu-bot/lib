const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/issue', verifyToken, isAdmin, transactionController.issueBook);
router.post('/return', verifyToken, isAdmin, transactionController.returnBook);
router.get('/issued', verifyToken, isAdmin, transactionController.getAllIssuedBooks);
router.get('/requests', verifyToken, isAdmin, transactionController.getIssueRequests);

module.exports = router;
