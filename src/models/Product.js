const crypto = require('crypto');

function generateId() {
  return crypto.randomUUID();
}

class Product {
  constructor(data) {
    this.id = data.id || generateId();
    this.name = data.name;
    this.description = data.description || '';
    this.price = data.price;
    this.category_id = data.category_id || null;
    this.image = data.image || null;
    this.inStock = data.inStock !== undefined ? data.inStock : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Валидация данных товара
  static validate(data, isUpdate = false) {
    const errors = [];

    if (!isUpdate) {
      if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('Название товара обязательно и должно быть непустой строкой');
      }

      if (data.price === undefined || typeof data.price !== 'number' || data.price < 0) {
        errors.push('Цена товара обязательна и должна быть положительным числом');
      }
    } else {
      if (data.name !== undefined && (typeof data.name !== 'string' || data.name.trim().length === 0)) {
        errors.push('Название товара должно быть непустой строкой');
      }

      if (data.price !== undefined && (typeof data.price !== 'number' || data.price < 0)) {
        errors.push('Цена товара должна быть положительным числом');
      }
    }

    if (data.description !== undefined && typeof data.description !== 'string') {
      errors.push('Описание должно быть строкой');
    }

    if (data.category_id !== undefined && data.category_id !== null && typeof data.category_id !== 'string') {
      errors.push('ID категории должен быть строкой');
    }

    if (data.inStock !== undefined && typeof data.inStock !== 'boolean') {
      errors.push('Поле inStock должно быть булевым значением');
    }

    return errors;
  }

  update(data) {
    if (data.name !== undefined) this.name = data.name;
    if (data.description !== undefined) this.description = data.description;
    if (data.price !== undefined) this.price = data.price;
    if (data.category_id !== undefined) this.category_id = data.category_id;
    if (data.image !== undefined) this.image = data.image;
    if (data.inStock !== undefined) this.inStock = data.inStock;
    this.updatedAt = new Date();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      category_id: this.category_id,
      image: this.image,
      inStock: this.inStock,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Product;