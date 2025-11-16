const { randomUUID } = require('crypto');

class User {
  constructor(data) {
    this.id = data.id || randomUUID();
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.emailVerified = data.emailVerified || false;
    this.verificationToken = data.verificationToken || null;
    this.resetPasswordToken = data.resetPasswordToken || null;
    this.resetPasswordExpires = data.resetPasswordExpires || null;
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
    if (data.emailVerified !== undefined) this.emailVerified = data.emailVerified;
    if (data.verificationToken !== undefined) this.verificationToken = data.verificationToken;
    if (data.resetPasswordToken !== undefined) this.resetPasswordToken = data.resetPasswordToken;
    if (data.resetPasswordExpires !== undefined) this.resetPasswordExpires = data.resetPasswordExpires;
    this.updatedAt = new Date().toISOString();
    this.validate();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      emailVerified: this.emailVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = User;
