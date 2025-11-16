const { randomUUID } = require('crypto');

class Order {
  constructor(data) {
    this.id = data.id || randomUUID();
    this.user_id = data.user_id;
    this.status = data.status || 'pending'; // pending, processing, completed, cancelled
    this.total_amount = data.total_amount || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();

    this.validate();
  }

  validate() {
    const errors = [];

    if (!this.user_id) {
      errors.push('ID пользователя обязателен');
    }

    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(this.status)) {
      errors.push('Недопустимый статус заказа');
    }

    if (typeof this.total_amount !== 'number' || this.total_amount < 0) {
      errors.push('Сумма заказа должна быть положительным числом');
    }

    if (errors.length > 0) {
      const error = new Error('Ошибка валидации заказа');
      error.errors = errors;
      throw error;
    }
  }

  update(data) {
    if (data.status !== undefined) this.status = data.status;
    if (data.total_amount !== undefined) this.total_amount = data.total_amount;
    this.updatedAt = new Date().toISOString();
    this.validate();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      status: this.status,
      total_amount: this.total_amount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Order;
