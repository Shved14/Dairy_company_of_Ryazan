# Молочная компания Рязани — Backend API

## Стек технологий

- **Node.js** + **Express**
- **PostgreSQL** + **Sequelize ORM**
- **JWT** авторизация
- **bcrypt** хеширование паролей

## Структура проекта

```
backend/
├── src/
│   ├── config/          # Конфигурация БД и приложения
│   ├── controllers/     # Контроллеры (обработка запросов)
│   ├── middleware/       # Middleware (auth, validation, errors)
│   ├── models/          # Sequelize модели
│   ├── routes/          # Маршруты API
│   ├── services/        # Бизнес-логика
│   ├── app.js           # Express приложение
│   └── server.js        # Точка входа
├── .env                 # Переменные окружения
├── .env.example         # Пример переменных окружения
└── package.json
```

## Установка и запуск

### 1. Установить зависимости

```bash
cd backend
npm install
```

### 2. Создать базу данных PostgreSQL

```sql
CREATE DATABASE dairy_company;
```

### 3. Настроить переменные окружения

Скопировать `.env.example` в `.env` и заполнить значения:

```bash
cp .env.example .env
```

### 4. Запустить сервер

```bash
# Development (с автоперезагрузкой)
npm run dev

# Production
npm start
```

Сервер запустится на `http://localhost:5000`.

## API Endpoints

### Продукты

| Метод  | Путь               | Доступ | Описание                  |
|--------|--------------------| -------|---------------------------|
| GET    | /api/products      | Public | Список продуктов          |
| GET    | /api/products/:id  | Public | Продукт по ID             |
| POST   | /api/products      | Admin  | Создать продукт           |
| PUT    | /api/products/:id  | Admin  | Обновить продукт          |
| DELETE | /api/products/:id  | Admin  | Удалить продукт           |

**Query-параметры для GET /api/products:**

- `search` — поиск по названию и описанию
- `category` — фильтрация по категории
- `page` — номер страницы (по умолчанию 1)
- `limit` — количество на странице (по умолчанию 20, макс. 100)

### Администратор

| Метод | Путь              | Доступ | Описание               |
|-------|-------------------| -------|------------------------|
| POST  | /api/admin/login  | Public | Авторизация            |
| POST  | /api/admin/create | Public | Создание администратора|

### Авторизация

Для защищённых маршрутов передавайте JWT-токен в заголовке:

```
Authorization: Bearer <token>
```

### Примеры запросов

**Создание администратора:**
```bash
curl -X POST http://localhost:5000/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{"login": "admin", "password": "password123"}'
```

**Авторизация:**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"login": "admin", "password": "password123"}'
```

**Создание продукта:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Молоко пастеризованное",
    "description": "Натуральное молоко 3.2%",
    "price": 89.90,
    "category": "Молоко",
    "fat": 3.2,
    "weight": 930,
    "image": "https://example.com/milk.jpg"
  }'
```

**Поиск и фильтрация:**
```bash
# Поиск
GET /api/products?search=молоко

# Фильтр по категории
GET /api/products?category=Молоко

# Комбинация
GET /api/products?search=натуральное&category=Молоко&page=1&limit=10
```
