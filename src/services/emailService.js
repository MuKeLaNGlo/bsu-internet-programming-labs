const nodemailer = require('nodemailer');
const config = require('../config');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  async initialize() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Проверка соединения (опционально)
    if (process.env.NODE_ENV !== 'test' && process.env.EMAIL_USER) {
      try {
        await this.transporter.verify();
        console.log('Email сервис готов к отправке писем');
      } catch (error) {
        console.error('Ошибка подключения к email серверу:', error.message);
      }
    }
  }

  async sendVerificationEmail(userEmail, userName, verificationToken) {
    if (!this.transporter) {
      await this.initialize();
    }

    if (!process.env.EMAIL_USER) {
      console.warn('Email сервис не настроен. Письмо не отправлено.');
      console.log(`Токен верификации для ${userEmail}: ${verificationToken}`);
      return;
    }

    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const verificationLink = `${appUrl}/api/auth/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Подтверждение email - Products API',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Добро пожаловать, ${userName}!</h2>
          <p>Спасибо за регистрацию в Products API.</p>
          <p>Для подтверждения вашего email адреса, пожалуйста, нажмите на кнопку ниже:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}"
               style="background-color: #4CAF50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Подтвердить Email
            </a>
          </div>
          <p>Или скопируйте и вставьте эту ссылку в браузер:</p>
          <p style="color: #666; word-break: break-all;">${verificationLink}</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 12px;">
            Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.
          </p>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Письмо с подтверждением отправлено:', info.messageId);
      return info;
    } catch (error) {
      console.error('Ошибка отправки email:', error);
      throw new Error('Не удалось отправить письмо с подтверждением');
    }
  }

  async sendPasswordResetEmail(userEmail, userName, resetToken) {
    if (!this.transporter) {
      await this.initialize();
    }

    if (!process.env.EMAIL_USER) {
      console.warn('Email сервис не настроен. Письмо не отправлено.');
      console.log(`Токен сброса пароля для ${userEmail}: ${resetToken}`);
      return;
    }

    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const resetLink = `${appUrl}/api/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Восстановление пароля - Products API',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Здравствуйте, ${userName}!</h2>
          <p>Вы запросили восстановление пароля для вашего аккаунта в Products API.</p>
          <p>Для сброса пароля, пожалуйста, нажмите на кнопку ниже:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}"
               style="background-color: #FF9800; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Сбросить пароль
            </a>
          </div>
          <p>Или скопируйте и вставьте эту ссылку в браузер:</p>
          <p style="color: #666; word-break: break-all;">${resetLink}</p>
          <p style="color: #d32f2f; margin-top: 20px;">
            <strong>Важно:</strong> Эта ссылка действительна в течение 1 часа.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 12px;">
            Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо. Ваш пароль останется без изменений.
          </p>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Письмо с восстановлением пароля отправлено:', info.messageId);
      return info;
    } catch (error) {
      console.error('Ошибка отправки email:', error);
      throw new Error('Не удалось отправить письмо с восстановлением пароля');
    }
  }
}

const emailService = new EmailService();

module.exports = emailService;
