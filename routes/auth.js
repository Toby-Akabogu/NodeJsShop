const express = require('express');
const path = require('path');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/logins', authController.getLogin);

module.exports = router;