const { randomUUID } = require('crypto');

class User {
  constructor(data) {
    this.id = data.id || randomUUID();
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();

    this.validate();
  }

  validate() {
    const errors = [];

    if (!this.email || this.email.trim() === '') {
      errors.push('Email обязателен');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errors.push('Некорректный формат email');
    }

    if (!this.name || this.name.trim() === '') {
      errors.push('Имя обязательно');
    }

    if (errors.length > 0) {
      const error = new Error('Ошибка валидации данных пользователя');
      error.statusCode = 400;
      error.details = errors;
      throw error;
    }
  }

  update(data) {
    if (data.email !== undefined) this.email = data.email;
    if (data.name !== undefined) this.name = data.name;
    if (data.password !== undefined) this.password = data.password;
    this.updatedAt = new Date().toISOString();
    this.validate();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = User;
