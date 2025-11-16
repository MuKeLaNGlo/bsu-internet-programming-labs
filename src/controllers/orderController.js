const database = require('../config/database');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

const orderController = {
  // Получить все заказы текущего пользователя
  async getUserOrders(req, res, next) {
    try {
      const userId = req.user.id;

      const orders = await database.all(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY createdAt DESC',
        [userId]
      );

      res.json({
        success: true,
        count: orders.length,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  },

  // Получить заказ по ID
  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const order = await database.get(
        'SELECT * FROM orders WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Заказ не найден'
        });
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  },

  // Получить товары заказа
  async getOrderItems(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Проверка, что заказ принадлежит пользователю
      const order = await database.get(
        'SELECT * FROM orders WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Заказ не найден'
        });
      }

      // Получение товаров заказа с информацией о продуктах
      const items = await database.all(
        `SELECT
          oi.*,
          p.name as product_name,
          p.description as product_description,
          p.image as product_image
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?`,
        [id]
      );

      res.json({
        success: true,
        count: items.length,
        data: items
      });
    } catch (error) {
      next(error);
    }
  },

  // Создать новый заказ
  async createOrder(req, res, next) {
    try {
      const { items } = req.body; // items: [{ product_id, quantity }]
      const userId = req.user.id;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Необходимо указать товары для заказа'
        });
      }

      let totalAmount = 0;
      const orderItems = [];

      // Проверяем все товары и рассчитываем сумму
      for (const item of items) {
        const product = await database.get(
          'SELECT * FROM products WHERE id = ?',
          [item.product_id]
        );

        if (!product) {
          return res.status(400).json({
            success: false,
            error: `Товар с ID ${item.product_id} не найден`
          });
        }

        if (!product.inStock) {
          return res.status(400).json({
            success: false,
            error: `Товар "${product.name}" нет в наличии`
          });
        }

        const quantity = item.quantity || 1;
        const itemTotal = product.price * quantity;
        totalAmount += itemTotal;

        orderItems.push({
          product_id: product.id,
          quantity,
          price_at_purchase: product.price
        });
      }

      // Создаем заказ
      const order = new Order({
        user_id: userId,
        status: 'pending',
        total_amount: totalAmount
      });

      await database.run(
        'INSERT INTO orders (id, user_id, status, total_amount, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
        [order.id, order.user_id, order.status, order.total_amount, order.createdAt, order.updatedAt]
      );

      // Создаем товары заказа
      for (const item of orderItems) {
        const orderItem = new OrderItem({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: item.price_at_purchase
        });

        await database.run(
          'INSERT INTO order_items (id, order_id, product_id, quantity, price_at_purchase, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [orderItem.id, orderItem.order_id, orderItem.product_id, orderItem.quantity, orderItem.price_at_purchase, orderItem.createdAt, orderItem.updatedAt]
        );
      }

      res.status(201).json({
        success: true,
        message: 'Заказ успешно создан',
        data: order.toJSON()
      });
    } catch (error) {
      next(error);
    }
  },

  // Обновить статус заказа
  async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user.id;

      const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Недопустимый статус заказа'
        });
      }

      const order = await database.get(
        'SELECT * FROM orders WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Заказ не найден'
        });
      }

      await database.run(
        'UPDATE orders SET status = ?, updatedAt = ? WHERE id = ?',
        [status, new Date().toISOString(), id]
      );

      const updatedOrder = await database.get('SELECT * FROM orders WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Статус заказа обновлен',
        data: updatedOrder
      });
    } catch (error) {
      next(error);
    }
  },

  // Удалить заказ
  async deleteOrder(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const order = await database.get(
        'SELECT * FROM orders WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Заказ не найден'
        });
      }

      // Удаление товаров заказа
      await database.run('DELETE FROM order_items WHERE order_id = ?', [id]);

      // Удаление заказа
      await database.run('DELETE FROM orders WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Заказ успешно удален'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = orderController;
