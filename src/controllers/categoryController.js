const categoryStore = require('../models/CategoryStore');

const categoryController = {
  async getAllCategories(req, res, next) {
    try {
      const categories = await categoryStore.getAllCategories();

      res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
      });
    } catch (error) {
      next(error);
    }
  },

  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await categoryStore.getCategoryById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Категория не найдена'
        });
      }

      res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      next(error);
    }
  },

  async createCategory(req, res, next) {
    try {
      const category = await categoryStore.createCategory(req.body);

      res.status(201).json({
        success: true,
        message: 'Категория успешно создана',
        data: category
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: error.message,
          details: error.details
        });
      }

      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({
          success: false,
          error: 'Категория с таким названием уже существует'
        });
      }

      next(error);
    }
  },

  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const category = await categoryStore.updateCategory(id, req.body);

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Категория не найдена'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Категория успешно обновлена',
        data: category
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: error.message,
          details: error.details
        });
      }

      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({
          success: false,
          error: 'Категория с таким названием уже существует'
        });
      }

      next(error);
    }
  },

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await categoryStore.deleteCategory(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Категория не найдена'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Категория успешно удалена'
      });
    } catch (error) {
      next(error);
    }
  },

  async uploadImage(req, res, next) {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Файл изображения не загружен'
        });
      }

      const imagePath = `/uploads/categories/${req.file.filename}`;
      const category = await categoryStore.updateCategory(id, { image: imagePath });

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Категория не найдена'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Изображение успешно загружено',
        data: category
      });
    } catch (error) {
      next(error);
    }
  },

  async getCategoryProducts(req, res, next) {
    try {
      const { id } = req.params;

      const category = await categoryStore.getCategoryById(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Категория не найдена'
        });
      }

      const products = await categoryStore.getProductsByCategory(id);

      res.status(200).json({
        success: true,
        category: category.name,
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = categoryController;
