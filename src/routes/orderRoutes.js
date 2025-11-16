const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/auth');

// Все маршруты заказов требуют авторизации
router.use(authMiddleware);

// Получить все заказы текущего пользователя
router.get('/', orderController.getUserOrders);

// Создать новый заказ
router.post('/', orderController.createOrder);

// Получить заказ по ID
router.get('/:id', orderController.getOrderById);

// Получить товары заказа
router.get('/:id/items', orderController.getOrderItems);

// Обновить статус заказа
router.patch('/:id/status', orderController.updateOrderStatus);

// Удалить заказ
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
