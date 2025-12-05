const express = require('express');
const router = express.Router();
const stockMovementController = require('../controllers/stockMovement.controller');
const { authenticateUser, isManager } = require('../middlewares/auth.middleware');

// Всі маршрути потребують авторизації
router.use(authenticateUser);

// Отримати всі рухи товарів
router.get('/', stockMovementController.getAll);

// Отримати рухи для конкретного товару
router.get('/product/:productId', stockMovementController.getByProduct);

// Створити новий рух (прийом/видача) - тільки менеджери та адміни
router.post('/', isManager, stockMovementController.create);

// Видалити рух (скасувати операцію) - тільки менеджери та адміни
router.delete('/:id', isManager, stockMovementController.delete);

module.exports = router;