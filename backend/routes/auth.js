const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateUser } = require('../middlewares/auth.middleware');

// Реєстрація користувача
router.post('/register', authController.register);

// Логін користувача
router.post('/login', authController.login);

// Отримання профілю (потрібна авторизація)
router.get('/profile', authenticateUser, authController.getProfile);

// Оновлення профілю (потрібна авторизація)
router.put('/profile', authenticateUser, authController.updateProfile);

module.exports = router;