const { randomUUID } = require('crypto');

class Review {
  constructor(data) {
    this.id = data.id || randomUUID();
    this.product_id = data.product_id;
    this.user_id = data.user_id;
    this.text = data.text;
    this.rating = data.rating || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();

    this.validate();
  }

  validate() {
    const errors = [];

    if (!this.product_id) {
      errors.push('ID товара обязателен');
    }

    if (!this.user_id) {
      errors.push('ID пользователя обязателен');
    }

    if (!this.text || this.text.trim().length === 0) {
      errors.push('Текст отзыва обязателен');
    }

    if (this.rating !== null && (typeof this.rating !== 'number' || this.rating < 1 || this.rating > 5)) {
      errors.push('Рейтинг должен быть числом от 1 до 5');
    }

    if (errors.length > 0) {
      const error = new Error('Ошибка валидации отзыва');
      error.errors = errors;
      throw error;
    }
  }

  toJSON() {
    return {
      id: this.id,
      product_id: this.product_id,
      user_id: this.user_id,
      text: this.text,
      rating: this.rating,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Review;
