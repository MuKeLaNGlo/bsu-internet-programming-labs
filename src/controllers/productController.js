const productStore = require('../models/ProductStore');
const Product = require('../models/Product');

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      const { category_id, inStock, minPrice, maxPrice, sortBy, order } = req.query;

      const filters = {
        category_id,
        inStock: inStock !== undefined ? inStock === 'true' : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        sortBy,
        order
      };

      const products = await productStore.getAllProducts(filters);

      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productStore.getProductById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Товар не найден'
        });
      }

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const validationErrors = Product.validate(req.body);

      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Ошибка валидации',
          details: validationErrors
        });
      }

      const product = await productStore.createProduct(req.body);

      res.status(201).json({
        success: true,
        message: 'Товар успешно создан',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;

      const validationErrors = Product.validate(req.body, true);

      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Ошибка валидации',
          details: validationErrors
        });
      }

      const product = await productStore.updateProduct(id, req.body);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Товар не найден'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Товар успешно обновлен',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await productStore.deleteProduct(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Товар не найден'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Товар успешно удален'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();