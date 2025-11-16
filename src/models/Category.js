const { randomUUID } = require('crypto');

class Category {
  constructor(data) {
    this.id = data.id || randomUUID();
    this.name = data.name;
    this.description = data.description || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();

    this.validate();
  }

  validate() {
    const errors = [];

    if (!this.name || typeof this.name !== 'string' || this.name.trim() === '') {
      errors.push('Название категории обязательно и должно быть непустой строкой');
    }

    if (this.description !== undefined && typeof this.description !== 'string') {
      errors.push('Описание категории должно быть строкой');
    }

    if (errors.length > 0) {
      const error = new Error('Ошибка валидации');
      error.name = 'ValidationError';
      error.details = errors;
      throw error;
    }
  }

  update(data) {
    if (data.name !== undefined) this.name = data.name;
    if (data.description !== undefined) this.description = data.description;
    this.updatedAt = new Date().toISOString();
    this.validate();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Category;
