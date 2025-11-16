const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Раздача статических файлов
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Products API Server with Categories, File Uploads and Authentication',
    version: '5.0.0',
    author: 'Михаил Каранинский',
    endpoints: {
      documentation: 'GET /',
      health: 'GET /health',
      static: 'GET /uploads/:type/:filename',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile (требуется токен)',
        verifyEmail: 'GET /api/auth/verify-email?token=<token>'
      },
      products: {
        list: 'GET /api/products (публичный)',
        getById: 'GET /api/products/:id (публичный)',
        create: 'POST /api/products (требуется токен)',
        update: 'PUT /api/products/:id (требуется токен)',
        delete: 'DELETE /api/products/:id (требуется токен)',
        uploadImage: 'POST /api/products/:id/upload-image (требуется токен)'
      },
      categories: {
        list: 'GET /api/categories (публичный)',
        getById: 'GET /api/categories/:id (публичный)',
        create: 'POST /api/categories (требуется токен)',
        update: 'PUT /api/categories/:id (требуется токен)',
        delete: 'DELETE /api/categories/:id (требуется токен)',
        products: 'GET /api/categories/:id/products (публичный)',
        uploadImage: 'POST /api/categories/:id/upload-image (требуется токен)'
      }
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Маршрут не найден'
  });
});

app.use(errorHandler);

module.exports = app;