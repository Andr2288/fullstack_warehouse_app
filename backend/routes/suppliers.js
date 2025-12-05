const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const { authenticateUser, isManager } = require('../middlewares/auth.middleware');

// Всі маршрути потребують авторизації
router.use(authenticateUser);

// Отримати всіх постачальників
router.get('/', supplierController.getAll);

// Отримати постачальника за ID
router.get('/:id', supplierController.getById);

// Створити постачальника (тільки менеджери та адміни)
router.post('/', isManager, supplierController.create);

// Оновити постачальника (тільки менеджери та адміни)
router.put('/:id', isManager, supplierController.update);

// Видалити постачальника (тільки менеджери та адміни)
router.delete('/:id', isManager, supplierController.delete);

module.exports = router;