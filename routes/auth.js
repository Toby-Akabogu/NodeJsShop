const express = require('express');
const path = require('path');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

module.exports = router;