const express = require('express');
const router = express.Router();
const { authenticateUser, isManager } = require('../middlewares/auth.middleware');

// Всі маршрути потребують авторизації
router.use(authenticateUser);

// Отримати всі категорії
router.get('/', async (req, res) => {
    res.json({ success: true, data: [] });
});

module.exports = router;