const { randomUUID } = require('crypto');

class OrderItem {
  constructor(data) {
    this.id = data.id || randomUUID();
    this.order_id = data.order_id;
    this.product_id = data.product_id;
    this.quantity = data.quantity || 1;
    this.price_at_purchase = data.price_at_purchase;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();

    this.validate();
  }

  validate() {
    const errors = [];

    if (!this.order_id) {
      errors.push('ID заказа обязателен');
    }

    if (!this.product_id) {
      errors.push('ID товара обязателен');
    }

    if (typeof this.quantity !== 'number' || this.quantity < 1) {
      errors.push('Количество должно быть положительным числом');
    }

    if (typeof this.price_at_purchase !== 'number' || this.price_at_purchase < 0) {
      errors.push('Цена должна быть положительным числом');
    }

    if (errors.length > 0) {
      const error = new Error('Ошибка валидации товара в заказе');
      error.errors = errors;
      throw error;
    }
  }

  update(data) {
    if (data.quantity !== undefined) this.quantity = data.quantity;
    if (data.price_at_purchase !== undefined) this.price_at_purchase = data.price_at_purchase;
    this.updatedAt = new Date().toISOString();
    this.validate();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      order_id: this.order_id,
      product_id: this.product_id,
      quantity: this.quantity,
      price_at_purchase: this.price_at_purchase,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = OrderItem;
