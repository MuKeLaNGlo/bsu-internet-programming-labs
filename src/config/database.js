const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const dbPath = path.join(__dirname, '../../data/products.db');

      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Подключение к SQLite базе данных успешно');
          resolve();
        }
      });
    });
  }

  async initialize() {
    await this.connect();
    await this.createTables();
    await this.seedData();
  }

  async createTables() {
    const createCategoriesTableSQL = `
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        image TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `;

    const createProductsTableSQL = `
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category_id TEXT,
        image TEXT,
        inStock INTEGER DEFAULT 1,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `;

    const createUsersTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        emailVerified INTEGER DEFAULT 0,
        verificationToken TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `;

    await this.run(createCategoriesTableSQL);
    await this.run(createProductsTableSQL);
    await this.run(createUsersTableSQL);
  }

  async seedData() {
    const { seedCategories, getSeedProducts } = require('./seedData');

    const categoriesCount = await this.get('SELECT COUNT(*) as count FROM categories');

    if (categoriesCount.count === 0) {
      for (const category of seedCategories) {
        await this.run(
          'INSERT INTO categories (id, name, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
          [category.id, category.name, category.description, category.createdAt, category.updatedAt]
        );
      }

      console.log('Тестовые категории добавлены');
    }

    const productsCount = await this.get('SELECT COUNT(*) as count FROM products');

    if (productsCount.count === 0) {
      const categories = await this.all('SELECT * FROM categories');
      const sampleProducts = getSeedProducts(categories);

      for (const product of sampleProducts) {
        await this.run(
          'INSERT INTO products (id, name, description, price, category_id, inStock, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [product.id, product.name, product.description, product.price, product.category_id, product.inStock, product.createdAt, product.updatedAt]
        );
      }

      console.log('Тестовые товары добавлены');
    }
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            console.log('Подключение к БД закрыто');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

const database = new Database();

module.exports = database;
