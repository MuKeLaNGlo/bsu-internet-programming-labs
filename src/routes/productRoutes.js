const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { uploadProductImage } = require('../middlewares/upload');
const authMiddleware = require('../middlewares/auth');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware, productController.createProduct);
router.put('/:id', authMiddleware, productController.updateProduct);
router.post('/:id/upload-image', authMiddleware, uploadProductImage, productController.uploadImage);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;