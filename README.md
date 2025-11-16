# Products API Server

API сервер для управления товарами. Выполнен в рамках лабораторной работы №2 по курсу "Актуальные вопросы интернет-программирования и разработки web-приложений".

**Автор:** Каранинский Михаил Евгеньевич

## Функциональность

- Просмотр списка товаров в JSON формате
- Получение товара по ID
- Добавление нового товара
- Изменение товара по ID
- Удаление товара по ID
- Фильтрация и сортировка товаров
- Валидация входных данных
- Обработка ошибок
- Хранение данных в SQLite

## Тестирование

Подробное описание тестирования всех эндпоинтов доступно в [TESTING.md](TESTING.md)

## Установка и запуск

```bash
# Клонировать репозиторий
git clone <repository-url>

# Перейти в директорию проекта
cd lab2-products-api

# Установить зависимости
npm install

# Запустить сервер
npm start

# Для разработки (с автоперезагрузкой)
npm run dev
```

Сервер будет доступен по адресу: http://localhost:3000

## API Endpoints

### Получить информацию об API
```
GET /
```

### Получить все товары
```
GET /api/products
```

**Query параметры:**
- `category` - фильтр по категории
- `inStock` - фильтр по наличию (true/false)
- `sortBy` - сортировка по полю (name, price, category)
- `order` - порядок сортировки (asc/desc)

**Пример:** `GET /api/products?category=электроника&sortBy=price&order=desc`

### Получить товар по ID
```
GET /api/products/:id
```

### Добавить новый товар
```
POST /api/products
Content-Type: application/json

{
    "name": "Название товара",
    "description": "Описание товара",
    "price": 1000,
    "category": "Категория",
    "inStock": true
}
```

**Обязательные поля:** `name`, `price`

### Обновить товар
```
PUT /api/products/:id
Content-Type: application/json

{
    "name": "Новое название",
    "description": "Новое описание",
    "price": 1500,
    "category": "Новая категория",
    "inStock": false
}
```

### Удалить товар
```
DELETE /api/products/:id
```

## Примеры запросов

### Получить все товары
```bash
curl http://localhost:3000/api/products
```

### Получить товар по ID
```bash
curl http://localhost:3000/api/products/1
```

### Добавить новый товар
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Клавиатура Logitech",
    "description": "Механическая игровая клавиатура",
    "price": 5999,
    "category": "Периферия",
    "inStock": true
  }'
```

### Обновить товар
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ноутбук Dell XPS 13 (Обновлен)",
    "price": 79999,
    "inStock": false
  }'
```

### Удалить товар
```bash
curl -X DELETE http://localhost:3000/api/products/1
```

## Формат ответа

Все ответы API имеют единый формат:

```json
{
    "success": true,
    "message": "Опциональное сообщение",
    "data": "Данные ответа",
    "count": "Количество элементов (для списков)"
}
```

При ошибке:
```json
{
    "success": false,
    "error": "Описание ошибки"
}
```

## Структура товара

```json
{
    "id": 1,
    "name": "Название товара",
    "description": "Описание товара",
    "price": 1000,
    "category": "Категория",
    "inStock": true,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

## Технологии

- **Node.js** - серверная среда
- **Express.js** - веб-фреймворк
- **SQLite3** - база данных
- **CORS** - поддержка кросс-доменных запросов
- **Helmet** - безопасность HTTP заголовков
- **Morgan** - логирование HTTP запросов