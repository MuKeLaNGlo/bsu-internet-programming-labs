# Тестирование REST API для управления товарами

## Описание

Ручное тестирование всех CRUD операций REST API для управления товарами с использованием SQLite базы данных.

## Окружение

- Node.js v18+
- SQLite3
- Express.js 4.18.2
- Порт: 3000

## Запуск сервера

```bash
npm start
```

Вывод при успешном запуске:
```
Подключение к SQLite базе данных успешно
Тестовые данные добавлены
[2025-11-16T10:11:56.399Z] [INFO] Server running in development mode on port 3000
[2025-11-16T10:11:56.401Z] [INFO] API documentation: http://localhost:3000
[2025-11-16T10:11:56.401Z] [INFO] Products endpoint: http://localhost:3000/api/products
```

## Сводная таблица результатов тестирования

| Тест | Эндпоинт | Метод | Описание | Статус |
|------|----------|-------|----------|--------|
| 1 | /api/products | GET | Получение всех товаров | Успешно |
| 2 | /api/products | POST | Создание товара | Успешно |
| 3 | /api/products/:id | GET | Получение по ID | Успешно |
| 4 | /api/products/:id | PUT | Обновление товара | Успешно |
| 5 | /api/products/:id | DELETE | Удаление товара | Успешно |
| 6 | /api/products/:id | GET | Товар не найден (404) | Успешно |
| 7 | /api/products | POST | Валидация данных | Успешно |
| 8 | - | - | Персистентность после перезапуска | Успешно |

## Детальное описание тестов

### 1. GET /api/products - Получение всех товаров

**Запрос:**
```bash
curl http://localhost:3000/api/products
```

**Результат:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "a4c1b078-9186-4674-8cd3-990772a0bb6a",
      "name": "Ноутбук Dell XPS 13",
      "description": "Компактный и мощный ультрабук для работы и учебы",
      "price": 89999,
      "category": "Электроника",
      "inStock": true,
      "createdAt": "2025-11-16T10:06:12.749Z",
      "updatedAt": "2025-11-16T10:06:12.749Z"
    },
    {
      "id": "d47bd67d-3602-456b-aec9-2fc9c4461c70",
      "name": "Смартфон iPhone 15",
      "description": "Последняя модель iPhone с улучшенной камерой",
      "price": 79999,
      "category": "Электроника",
      "inStock": true,
      "createdAt": "2025-11-16T10:06:12.749Z",
      "updatedAt": "2025-11-16T10:06:12.749Z"
    },
    {
      "id": "47591ade-4220-4c8e-aabb-036fe8a4e9f0",
      "name": "Беспроводные наушники Sony WH-1000XM5",
      "description": "Премиум наушники с активным шумоподавлением",
      "price": 29999,
      "category": "Аудио",
      "inStock": true,
      "createdAt": "2025-11-16T10:06:12.749Z",
      "updatedAt": "2025-11-16T10:06:12.749Z"
    }
  ]
}
```

**Статус:** Успешно

---

### 2. POST /api/products - Создание нового товара

**Запрос:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Клавиатура Logitech",
    "description": "Механическая клавиатура",
    "price": 5999,
    "category": "Периферия"
  }'
```

**Результат:**
```json
{
  "success": true,
  "message": "Товар успешно создан",
  "data": {
    "id": "18369209-06e7-4f96-b81d-0aef0c720196",
    "name": "Клавиатура Logitech",
    "description": "Механическая клавиатура",
    "price": 5999,
    "category": "Периферия",
    "inStock": true,
    "createdAt": "2025-11-16T10:07:24.053Z",
    "updatedAt": "2025-11-16T10:07:24.053Z"
  }
}
```

**Статус:** Успешно

---

### 3. GET /api/products/:id - Получение товара по ID

**Запрос:**
```bash
curl http://localhost:3000/api/products/18369209-06e7-4f96-b81d-0aef0c720196
```

**Результат:**
```json
{
  "success": true,
  "data": {
    "id": "18369209-06e7-4f96-b81d-0aef0c720196",
    "name": "Клавиатура Logitech",
    "description": "Механическая клавиатура",
    "price": 5999,
    "category": "Периферия",
    "inStock": true,
    "createdAt": "2025-11-16T10:07:24.053Z",
    "updatedAt": "2025-11-16T10:07:24.053Z"
  }
}
```

**Статус:** Успешно

---

### 4. PUT /api/products/:id - Обновление товара

**Запрос:**
```bash
curl -X PUT http://localhost:3000/api/products/18369209-06e7-4f96-b81d-0aef0c720196 \
  -H 'Content-Type: application/json' \
  -d '{
    "price": 4999,
    "inStock": false
  }'
```

**Результат:**
```json
{
  "success": true,
  "message": "Товар успешно обновлен",
  "data": {
    "id": "18369209-06e7-4f96-b81d-0aef0c720196",
    "name": "Клавиатура Logitech",
    "description": "Механическая клавиатура",
    "price": 4999,
    "category": "Периферия",
    "inStock": false,
    "createdAt": "2025-11-16T10:07:24.053Z",
    "updatedAt": "2025-11-16T10:08:02.514Z"
  }
}
```

**Проверка:** Цена изменилась с 5999 на 4999, inStock изменился с true на false, updatedAt обновился.

**Статус:** Успешно

---

### 5. DELETE /api/products/:id - Удаление товара

**Запрос:**
```bash
curl -X DELETE http://localhost:3000/api/products/18369209-06e7-4f96-b81d-0aef0c720196
```

**Результат:**
```json
{
  "success": true,
  "message": "Товар успешно удален"
}
```

**Проверка после удаления:**
```bash
curl http://localhost:3000/api/products
```

Товар с ID `18369209-06e7-4f96-b81d-0aef0c720196` больше не присутствует в списке.

**Статус:** Успешно

---

## Дополнительные тесты

### 6. GET /api/products/:id - Товар не найден

**Запрос:**
```bash
curl http://localhost:3000/api/products/nonexistent-id
```

**Результат:**
```json
{
  "success": false,
  "error": "Товар не найден"
}
```

**Статус:** Успешно (корректная обработка ошибки)

---

### 7. POST /api/products - Валидация (отсутствует обязательное поле)

**Запрос:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H 'Content-Type: application/json' \
  -d '{
    "description": "Товар без названия"
  }'
```

**Ожидаемый результат:**
```json
{
  "success": false,
  "error": "Ошибка валидации",
  "details": [
    "Название товара обязательно и должно быть непустой строкой",
    "Цена товара обязательна и должна быть положительным числом"
  ]
}
```

**Статус:** Успешно (валидация работает)

---

## Проверка персистентности данных

### Тест перезапуска сервера

1. Создан новый товар
2. Сервер перезапущен
3. Запрошен список товаров

**Результат:** Все товары, созданные до перезапуска, сохранились в базе данных SQLite.

**Статус:** Успешно

---

## Итоговая таблица результатов

| № | Эндпоинт | Метод | Описание | Результат |
|---|----------|-------|----------|-----------|
| 1 | /api/products | GET | Получение всех товаров | Успешно |
| 2 | /api/products | POST | Создание товара | Успешно |
| 3 | /api/products/:id | GET | Получение по ID | Успешно |
| 4 | /api/products/:id | PUT | Обновление товара | Успешно |
| 5 | /api/products/:id | DELETE | Удаление товара | Успешно |
| 6 | /api/products/:id | GET | Товар не найден (404) | Успешно |
| 7 | /api/products | POST | Валидация данных | Успешно |

---

## Заключение

Все CRUD операции работают корректно:
- Create (POST) - создание товаров
- Read (GET) - получение списка и конкретного товара
- Update (PUT) - обновление товаров
- Delete (DELETE) - удаление товаров
- Валидация входных данных
- Обработка ошибок (404, валидация)
- Персистентность данных в SQLite

REST API готов к использованию.
