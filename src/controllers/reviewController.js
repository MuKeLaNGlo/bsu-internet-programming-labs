const database = require('../config/database');
const Review = require('../models/Review');

const reviewController = {
  // Получить все отзывы товара
  async getProductReviews(req, res, next) {
    try {
      const { productId } = req.params;

      const reviews = await database.all(
        `SELECT r.*, u.first_name, u.last_name, u.email
         FROM reviews r
         LEFT JOIN users u ON r.user_id = u.id
         WHERE r.product_id = ?
         ORDER BY r.createdAt DESC`,
        [productId]
      );

      res.json({
        success: true,
        count: reviews.length,
        data: reviews
      });
    } catch (error) {
      next(error);
    }
  },

  // Получить отзыв по ID
  async getReviewById(req, res, next) {
    try {
      const { id } = req.params;

      const review = await database.get(
        `SELECT r.*, u.first_name, u.last_name, u.email
         FROM reviews r
         LEFT JOIN users u ON r.user_id = u.id
         WHERE r.id = ?`,
        [id]
      );

      if (!review) {
        return res.status(404).json({
          success: false,
          error: 'Отзыв не найден'
        });
      }

      res.json({
        success: true,
        data: review
      });
    } catch (error) {
      next(error);
    }
  },

  // Создать новый отзыв
  async createReview(req, res, next) {
    try {
      const { product_id, text, rating } = req.body;
      const userId = req.user.id;

      // Проверка, что товар существует
      const product = await database.get(
        'SELECT * FROM products WHERE id = ?',
        [product_id]
      );

      if (!product) {
        return res.status(400).json({
          success: false,
          error: 'Товар не найден'
        });
      }

      const review = new Review({
        product_id,
        user_id: userId,
        text,
        rating: rating ? parseInt(rating) : null
      });

      await database.run(
        'INSERT INTO reviews (id, product_id, user_id, text, rating, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [review.id, review.product_id, review.user_id, review.text, review.rating, review.createdAt, review.updatedAt]
      );

      res.status(201).json({
        success: true,
        message: 'Отзыв успешно создан',
        data: review.toJSON()
      });
    } catch (error) {
      next(error);
    }
  },

  // Обновить отзыв
  async updateReview(req, res, next) {
    try {
      const { id } = req.params;
      const { text, rating } = req.body;
      const userId = req.user.id;

      const review = await database.get(
        'SELECT * FROM reviews WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (!review) {
        return res.status(404).json({
          success: false,
          error: 'Отзыв не найден или у вас нет прав для его изменения'
        });
      }

      const updatedText = text !== undefined ? text : review.text;
      const updatedRating = rating !== undefined ? parseInt(rating) : review.rating;

      await database.run(
        'UPDATE reviews SET text = ?, rating = ?, updatedAt = ? WHERE id = ?',
        [updatedText, updatedRating, new Date().toISOString(), id]
      );

      const updatedReview = await database.get('SELECT * FROM reviews WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Отзыв обновлен',
        data: updatedReview
      });
    } catch (error) {
      next(error);
    }
  },

  // Удалить отзыв
  async deleteReview(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const review = await database.get(
        'SELECT * FROM reviews WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (!review) {
        return res.status(404).json({
          success: false,
          error: 'Отзыв не найден или у вас нет прав для его удаления'
        });
      }

      await database.run('DELETE FROM reviews WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Отзыв успешно удален'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = reviewController;
