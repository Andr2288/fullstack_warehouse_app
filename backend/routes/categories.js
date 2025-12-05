const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateUser, isManager } = require('../middlewares/auth.middleware');

// Всі маршрути потребують авторизації
router.use(authenticateUser);

// Отримати всі категорії
router.get('/', categoryController.getAll);

// Отримати категорію за ID
router.get('/:id', categoryController.getById);

// Створити нову категорію (тільки менеджери та адміни)
router.post('/', isManager, categoryController.create);

// Оновити категорію (тільки менеджери та адміни)
router.put('/:id', isManager, categoryController.update);

// Видалити категорію (тільки менеджери та адміни)
router.delete('/:id', isManager, categoryController.delete);

module.exports = router;