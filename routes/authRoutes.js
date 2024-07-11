const express = require('express');
const router = express.Router();
const { register, activate, login, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/activate/:token', activate);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
