const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const database = require('../config/database');
const User = require('../models/User');
const emailService = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

const authController = {
  async getProfile(req, res, next) {
    try {
      const userRow = await database.get('SELECT * FROM users WHERE id = ?', [req.user.id]);

      if (!userRow) {
        return res.status(404).json({
          error: 'Пользователь не найден'
        });
      }

      const user = new User(userRow);

      res.json({
        user: user.toJSON()
      });
    } catch (error) {
      next(error);
    }
  },

  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({
          error: 'Email, пароль и имя обязательны'
        });
      }

      const existingUser = await database.get('SELECT * FROM users WHERE email = ?', [email]);

      if (existingUser) {
        return res.status(400).json({
          error: 'Пользователь с таким email уже существует'
        });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const verificationToken = crypto.randomBytes(32).toString('hex');

      const user = new User({
        email,
        password: hashedPassword,
        name,
        emailVerified: false,
        verificationToken
      });

      await database.run(
        'INSERT INTO users (id, email, password, name, emailVerified, verificationToken, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [user.id, user.email, user.password, user.name, user.emailVerified ? 1 : 0, user.verificationToken, user.createdAt, user.updatedAt]
      );

      // Отправка письма с подтверждением
      try {
        await emailService.sendVerificationEmail(user.email, user.name, verificationToken);
      } catch (emailError) {
        console.error('Ошибка отправки письма:', emailError);
        // Продолжаем регистрацию даже если письмо не отправилось
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'Регистрация успешна. Проверьте email для подтверждения.',
        user: user.toJSON(),
        token
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: 'Email и пароль обязательны'
        });
      }

      const userRow = await database.get('SELECT * FROM users WHERE email = ?', [email]);

      if (!userRow) {
        return res.status(401).json({
          error: 'Неверный email или пароль'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, userRow.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Неверный email или пароль'
        });
      }

      const user = new User(userRow);

      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Авторизация успешна',
        user: user.toJSON(),
        token
      });
    } catch (error) {
      next(error);
    }
  },

  async verifyEmail(req, res, next) {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({
          error: 'Токен верификации не предоставлен'
        });
      }

      const userRow = await database.get('SELECT * FROM users WHERE verificationToken = ?', [token]);

      if (!userRow) {
        return res.status(400).json({
          error: 'Недействительный токен верификации'
        });
      }

      if (userRow.emailVerified) {
        return res.status(200).json({
          message: 'Email уже подтвержден'
        });
      }

      await database.run(
        'UPDATE users SET emailVerified = ?, verificationToken = ?, updatedAt = ? WHERE id = ?',
        [1, null, new Date().toISOString(), userRow.id]
      );

      res.json({
        message: 'Email успешно подтвержден'
      });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          error: 'Email обязателен'
        });
      }

      const userRow = await database.get('SELECT * FROM users WHERE email = ?', [email]);

      if (!userRow) {
        // Не раскрываем, существует ли пользователь
        return res.json({
          message: 'Если пользователь с таким email существует, письмо с инструкциями отправлено'
        });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetPasswordExpires = new Date(Date.now() + 3600000).toISOString(); // 1 час

      await database.run(
        'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ?, updatedAt = ? WHERE id = ?',
        [resetToken, resetPasswordExpires, new Date().toISOString(), userRow.id]
      );

      // Отправка письма с инструкциями
      try {
        await emailService.sendPasswordResetEmail(userRow.email, userRow.name, resetToken);
      } catch (emailError) {
        console.error('Ошибка отправки письма:', emailError);
        // Продолжаем даже если письмо не отправилось
      }

      res.json({
        message: 'Если пользователь с таким email существует, письмо с инструкциями отправлено'
      });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          error: 'Токен и новый пароль обязательны'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          error: 'Пароль должен быть не менее 6 символов'
        });
      }

      const userRow = await database.get('SELECT * FROM users WHERE resetPasswordToken = ?', [token]);

      if (!userRow) {
        return res.status(400).json({
          error: 'Недействительный токен сброса пароля'
        });
      }

      // Проверка срока действия токена
      const now = new Date();
      const expiresAt = new Date(userRow.resetPasswordExpires);

      if (now > expiresAt) {
        return res.status(400).json({
          error: 'Срок действия токена истек. Запросите сброс пароля заново'
        });
      }

      // Хеширование нового пароля
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

      // Обновление пароля и очистка токена
      await database.run(
        'UPDATE users SET password = ?, resetPasswordToken = ?, resetPasswordExpires = ?, updatedAt = ? WHERE id = ?',
        [hashedPassword, null, null, new Date().toISOString(), userRow.id]
      );

      res.json({
        message: 'Пароль успешно изменен'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
