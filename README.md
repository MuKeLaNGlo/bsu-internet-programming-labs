# Products API Server

REST API для управления товарами и категориями с поддержкой загрузки файлов, авторизацией и подтверждением email.

**Автор:** Каранинский Михаил Евгеньевич

## Функциональность

- CRUD операции для товаров и категорий
- Связь один-ко-многим между категориями и товарами
- Загрузка изображений для товаров и категорий
- Раздача статических файлов
- Регистрация и авторизация пользователей
- JWT токены для аутентификации
- Подтверждение email адреса пользователя
- Восстановление пароля через email
- Защищенные маршруты (требующие авторизации)
- Фильтрация и валидация данных
- Хранение данных в SQLite

## API Endpoints

### Auth
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Авторизация пользователя
- `GET /api/auth/profile` - Получить профиль (требуется токен)
- `GET /api/auth/verify-email?token=<token>` - Подтверждение email
- `POST /api/auth/forgot-password` - Запрос на восстановление пароля
- `POST /api/auth/reset-password` - Сброс пароля по токену

### Products
- `GET /api/products` - Получить все товары (публичный)
- `GET /api/products/:id` - Получить товар по ID (публичный)
- `POST /api/products` - Создать товар (требуется токен)
- `PUT /api/products/:id` - Обновить товар (требуется токен)
- `DELETE /api/products/:id` - Удалить товар (требуется токен)
- `POST /api/products/:id/upload-image` - Загрузить изображение (требуется токен)

### Categories
- `GET /api/categories` - Получить все категории (публичный)
- `GET /api/categories/:id` - Получить категорию по ID (публичный)
- `POST /api/categories` - Создать категорию (требуется токен)
- `PUT /api/categories/:id` - Обновить категорию (требуется токен)
- `DELETE /api/categories/:id` - Удалить категорию (требуется токен)
- `GET /api/categories/:id/products` - Получить товары категории (публичный)
- `POST /api/categories/:id/upload-image` - Загрузить изображение (требуется токен)

### Static Files
- `GET /uploads/products/:filename` - Получить изображение товара
- `GET /uploads/categories/:filename` - Получить изображение категории

## Примеры запросов

### Регистрация и авторизация

#### Регистрация пользователя
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "name": "Иван Иванов"
  }'
```

#### Авторизация
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

### Восстановление пароля

Система поддерживает два способа восстановления пароля:

#### Вариант 1: Через email (рекомендуется)

1. Запросить восстановление пароля:
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

2. Пользователь получает email с токеном восстановления (если email сервис настроен)

3. Установить новый пароль, используя токен из письма:
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "токен-из-письма",
    "newPassword": "newSecurePassword123"
  }'
```

#### Вариант 2: Без email (для разработки/тестирования)

Если email сервис не настроен (отсутствует `EMAIL_USER` в `.env`), токен восстановления будет выведен в консоль сервера:

1. Запросить восстановление:
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

2. Найти токен в логах сервера:
```
Токен сброса пароля для user@example.com: abc123def456...
```

3. Использовать токен для сброса пароля:
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123def456...",
    "newPassword": "newPassword123"
  }'
```

**Важно:** Токены восстановления пароля действительны в течение 1 часа.

#### Как работает механизм сброса пароля

Система восстановления пароля реализована с учетом современных требований безопасности:

**Процесс восстановления:**

1. **Запрос на восстановление** (`POST /api/auth/forgot-password`):
   - Пользователь отправляет свой email
   - Система генерирует уникальный токен используя `crypto.randomBytes(32)` (64 hex символа)
   - Токен и время истечения (текущее время + 1 час) сохраняются в БД
   - Отправляется email с токеном или токен выводится в консоль (если email не настроен)
   - Возвращается общее сообщение, не раскрывающее существование пользователя

2. **Установка нового пароля** (`POST /api/auth/reset-password`):
   - Пользователь отправляет токен и новый пароль
   - Система проверяет наличие токена в БД
   - Проверяется срок действия токена (не более 1 часа с момента создания)
   - Новый пароль хешируется с помощью bcrypt (10 раундов)
   - Пароль обновляется в БД, токен и время истечения очищаются
   - Возвращается подтверждение успешной смены пароля

**Особенности безопасности:**

- **Одноразовые токены**: После использования токен удаляется из БД
- **Ограниченный срок действия**: Токены действительны только 1 час
- **Защита от перебора**: Унифицированные сообщения об ошибках
- **Безопасное хранение**: Пароли хешируются с помощью bcrypt
- **Отсутствие user enumeration**: Система не раскрывает, существует ли пользователь
- **Криптографически стойкие токены**: Используется `crypto.randomBytes` для генерации

**Хранение в базе данных:**

Таблица `users` содержит поля:

- `resetPasswordToken` (TEXT) - хранит токен сброса пароля
- `resetPasswordExpires` (TEXT) - дата/время истечения токена в ISO формате

### Работа с товарами

#### Создать товар
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Ноутбук Dell XPS 13",
    "description": "Компактный ультрабук",
    "price": 89999,
    "category_id": "uuid-категории",
    "inStock": true
  }'
```

#### Загрузить изображение товара
```bash
curl -X POST -F "image=@product.jpg" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/products/{id}/upload-image
```

## Технологии

- Node.js + Express.js
- SQLite3
- Multer (загрузка файлов)
- bcrypt (хеширование паролей)
- JWT (токены авторизации)
- Nodemailer (отправка email)
- CORS, Helmet, Morgan

## Настройка

1. Скопируйте [.env.example](.env.example) в `.env` и заполните необходимые переменные окружения:
   ```bash
   cp .env.example .env
   ```

2. Настройте параметры email сервера в файле `.env`:
   - `EMAIL_HOST` - SMTP сервер
   - `EMAIL_PORT` - порт SMTP
   - `EMAIL_USER` - email для отправки
   - `EMAIL_PASSWORD` - пароль или app password
   - `EMAIL_FROM` - адрес отправителя

3. Установите зависимости и запустите сервер:
   ```bash
   npm install
   npm start
   ```
