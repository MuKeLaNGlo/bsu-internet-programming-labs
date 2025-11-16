const crypto = require('crypto');

// Тестовые данные для заполнения базы данных
const seedCategories = [
  {
    id: crypto.randomUUID(),
    name: 'Электроника',
    description: 'Электронные устройства и гаджеты',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    name: 'Аудио',
    description: 'Аудиотехника и наушники',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    name: 'Периферия',
    description: 'Компьютерная периферия',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Функция для получения тестовых товаров (принимает категории для привязки)
const getSeedProducts = (categories) => {
  const electronicsCategory = categories.find(c => c.name === 'Электроника');
  const audioCategory = categories.find(c => c.name === 'Аудио');

  return [
    {
      id: crypto.randomUUID(),
      name: 'Ноутбук Dell XPS 13',
      description: 'Компактный и мощный ультрабук для работы и учебы',
      price: 89999,
      category_id: electronicsCategory.id,
      stock_quantity: 15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: 'Смартфон iPhone 15',
      description: 'Последняя модель iPhone с улучшенной камерой',
      price: 79999,
      category_id: electronicsCategory.id,
      stock_quantity: 25,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: 'Беспроводные наушники Sony WH-1000XM5',
      description: 'Премиум наушники с активным шумоподавлением',
      price: 29999,
      category_id: audioCategory.id,
      stock_quantity: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};

module.exports = {
  seedCategories,
  getSeedProducts
};
