const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/auth.middleware');

// Всі маршрути потребують авторизації
router.use(authenticateUser);

// Отримати всіх постачальників
router.get('/', async (req, res) => {
    res.json({ success: true, data: [] });
});

module.exports = router;