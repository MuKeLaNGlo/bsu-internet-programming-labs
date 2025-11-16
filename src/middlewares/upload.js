const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Конфигурация хранилища для товаров
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/products');
  },
  filename: (req, file, cb) => {
    const uniqueId = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

// Конфигурация хранилища для категорий
const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/categories');
  },
  filename: (req, file, cb) => {
    const uniqueId = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

// Фильтр для проверки типа файла (только изображения)
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Разрешены только изображения (JPEG, JPG, PNG, GIF, WEBP)'));
  }
};

// Middleware для загрузки изображений товаров
const uploadProductImage = multer({
  storage: productStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Максимум 5MB
  }
}).single('image');

// Middleware для загрузки изображений категорий
const uploadCategoryImage = multer({
  storage: categoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Максимум 5MB
  }
}).single('image');

module.exports = {
  uploadProductImage,
  uploadCategoryImage
};
