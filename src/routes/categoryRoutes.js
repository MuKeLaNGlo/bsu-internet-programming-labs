const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { uploadCategoryImage } = require('../middlewares/upload');
const authMiddleware = require('../middlewares/auth');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', authMiddleware, categoryController.createCategory);
router.put('/:id', authMiddleware, categoryController.updateCategory);
router.post('/:id/upload-image', authMiddleware, uploadCategoryImage, categoryController.uploadImage);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);
router.get('/:id/products', categoryController.getCategoryProducts);

module.exports = router;
