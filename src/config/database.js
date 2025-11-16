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

  createTables() {
    return new Promise((resolve, reject) => {
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          category TEXT DEFAULT 'Без категории',
          inStock INTEGER DEFAULT 1,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )
      `;

      this.db.run(createTableSQL, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async seedData() {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT COUNT(*) as count FROM products', async (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (row.count === 0) {
          const crypto = require('crypto');
          const sampleProducts = [
            {
              id: crypto.randomUUID(),
              name: 'Ноутбук Dell XPS 13',
              description: 'Компактный и мощный ультрабук для работы и учебы',
              price: 89999,
              category: 'Электроника',
              inStock: 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: crypto.randomUUID(),
              name: 'Смартфон iPhone 15',
              description: 'Последняя модель iPhone с улучшенной камерой',
              price: 79999,
              category: 'Электроника',
              inStock: 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: crypto.randomUUID(),
              name: 'Беспроводные наушники Sony WH-1000XM5',
              description: 'Премиум наушники с активным шумоподавлением',
              price: 29999,
              category: 'Аудио',
              inStock: 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ];

          const insertSQL = `
            INSERT INTO products (id, name, description, price, category, inStock, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const stmt = this.db.prepare(insertSQL);

          for (const product of sampleProducts) {
            stmt.run(
              product.id,
              product.name,
              product.description,
              product.price,
              product.category,
              product.inStock,
              product.createdAt,
              product.updatedAt
            );
          }

          stmt.finalize((err) => {
            if (err) {
              reject(err);
            } else {
              console.log('Тестовые данные добавлены');
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    });
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
