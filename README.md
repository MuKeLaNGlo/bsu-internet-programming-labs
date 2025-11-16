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
- Защищенные маршруты (требующие авторизации)
- Фильтрация и валидация данных
- Хранение данных в SQLite

## API Endpoints

### Auth
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Авторизация пользователя
- `GET /api/auth/profile` - Получить профиль (требуется токен)
- `GET /api/auth/verify-email?token=<token>` - Подтверждение email

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

### Создать товар
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ноутбук Dell XPS 13",
    "description": "Компактный ультрабук",
    "price": 89999,
    "category_id": "uuid-категории",
    "inStock": true
  }'
```

### Загрузить изображение товара
```bash
curl -X POST -F "image=@product.jpg" \
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
