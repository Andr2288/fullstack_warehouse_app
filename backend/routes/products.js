const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateUser, isManager } = require('../middlewares/auth.middleware');

// Всі маршрути потребують авторизації
router.use(authenticateUser);

// Отримати всі товари
router.get('/', productController.getAll);

// Отримати товари з низькими залишками
router.get('/low-stock', productController.getLowStock);

// Отримати товар за ID
router.get('/:id', productController.getById);

// Створити новий товар (тільки менеджери та адміни)
router.post('/', isManager, productController.create);

// Оновити товар (тільки менеджери та адміни)
router.put('/:id', isManager, productController.update);

// Видалити товар (тільки менеджери та адміни)
router.delete('/:id', isManager, productController.delete);

module.exports = router;