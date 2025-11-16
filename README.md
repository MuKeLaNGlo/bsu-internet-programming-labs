# Products API Server

REST API для управления товарами и категориями с поддержкой загрузки файлов и авторизацией.

**Автор:** Каранинский Михаил Евгеньевич

## Функциональность

- CRUD операции для товаров и категорий
- Связь один-ко-многим между категориями и товарами
- Загрузка изображений для товаров и категорий
- Раздача статических файлов
- Регистрация и авторизация пользователей
- JWT токены для аутентификации
- Фильтрация и валидация данных
- Хранение данных в SQLite

## API Endpoints

### Auth
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Авторизация пользователя
- `GET /api/auth/profile` - Получить профиль (требуется токен)

### Products
- `GET /api/products` - Получить все товары
- `GET /api/products/:id` - Получить товар по ID
- `POST /api/products` - Создать товар
- `PUT /api/products/:id` - Обновить товар
- `DELETE /api/products/:id` - Удалить товар
- `POST /api/products/:id/upload-image` - Загрузить изображение

### Categories
- `GET /api/categories` - Получить все категории
- `GET /api/categories/:id` - Получить категорию по ID
- `POST /api/categories` - Создать категорию
- `PUT /api/categories/:id` - Обновить категорию
- `DELETE /api/categories/:id` - Удалить категорию
- `GET /api/categories/:id/products` - Получить товары категории
- `POST /api/categories/:id/upload-image` - Загрузить изображение

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
- CORS, Helmet, Morgan
