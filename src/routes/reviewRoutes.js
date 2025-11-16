const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/auth');

// Публичные маршруты
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/:id', reviewController.getReviewById);

// Защищенные маршруты (требуют авторизации)
router.post('/', authMiddleware, reviewController.createReview);
router.put('/:id', authMiddleware, reviewController.updateReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;
