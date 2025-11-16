const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { uploadCategoryImage } = require('../middlewares/upload');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.post('/:id/upload-image', uploadCategoryImage, categoryController.uploadImage);
router.delete('/:id', categoryController.deleteCategory);
router.get('/:id/products', categoryController.getCategoryProducts);

module.exports = router;
