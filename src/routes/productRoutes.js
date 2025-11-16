const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { uploadProductImage } = require('../middlewares/upload');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.post('/:id/upload-image', uploadProductImage, productController.uploadImage);
router.delete('/:id', productController.deleteProduct);

module.exports = router;