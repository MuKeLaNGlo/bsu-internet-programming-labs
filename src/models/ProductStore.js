const Product = require('./Product');
const database = require('../config/database');

class ProductStore {
  async getAllProducts(filters = {}) {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (filters.category_id) {
      sql += ' AND category_id = ?';
      params.push(filters.category_id);
    }

    if (filters.inStock !== undefined) {
      sql += ' AND inStock = ?';
      params.push(filters.inStock ? 1 : 0);
    }

    if (filters.minPrice !== undefined) {
      sql += ' AND price >= ?';
      params.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      sql += ' AND price <= ?';
      params.push(filters.maxPrice);
    }

    if (filters.sortBy) {
      const sortField = filters.sortBy;
      const sortOrder = filters.order === 'desc' ? 'DESC' : 'ASC';
      sql += ` ORDER BY ${sortField} ${sortOrder}`;
    }

    const rows = await database.all(sql, params);
    return rows.map(row => this.rowToProduct(row));
  }

  async getProductById(id) {
    const row = await database.get('SELECT * FROM products WHERE id = ?', [id]);
    return row ? this.rowToProduct(row) : null;
  }

  async createProduct(data) {
    const product = new Product(data);

    const sql = `
      INSERT INTO products (id, name, description, price, category_id, image, inStock, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await database.run(sql, [
      product.id,
      product.name,
      product.description,
      product.price,
      product.category_id,
      product.image,
      product.inStock ? 1 : 0,
      product.createdAt.toISOString(),
      product.updatedAt.toISOString()
    ]);

    return product;
  }

  async updateProduct(id, data) {
    const existingProduct = await this.getProductById(id);
    if (!existingProduct) return null;

    const updatedData = {
      name: data.name !== undefined ? data.name : existingProduct.name,
      description: data.description !== undefined ? data.description : existingProduct.description,
      price: data.price !== undefined ? data.price : existingProduct.price,
      category_id: data.category_id !== undefined ? data.category_id : existingProduct.category_id,
      image: data.image !== undefined ? data.image : existingProduct.image,
      inStock: data.inStock !== undefined ? data.inStock : existingProduct.inStock,
      updatedAt: new Date()
    };

    const sql = `
      UPDATE products
      SET name = ?, description = ?, price = ?, category_id = ?, image = ?, inStock = ?, updatedAt = ?
      WHERE id = ?
    `;

    await database.run(sql, [
      updatedData.name,
      updatedData.description,
      updatedData.price,
      updatedData.category_id,
      updatedData.image,
      updatedData.inStock ? 1 : 0,
      updatedData.updatedAt.toISOString(),
      id
    ]);

    return await this.getProductById(id);
  }

  async deleteProduct(id) {
    const result = await database.run('DELETE FROM products WHERE id = ?', [id]);
    return result.changes > 0;
  }

  async getCount() {
    const row = await database.get('SELECT COUNT(*) as count FROM products');
    return row.count;
  }

  rowToProduct(row) {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      category_id: row.category_id,
      image: row.image,
      inStock: row.inStock === 1,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }
}

const productStore = new ProductStore();

module.exports = productStore;