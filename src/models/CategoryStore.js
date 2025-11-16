const database = require('../config/database');
const Category = require('./Category');

class CategoryStore {
  rowToCategory(row) {
    return new Category({
      id: row.id,
      name: row.name,
      description: row.description,
      image: row.image,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    });
  }

  async getAllCategories() {
    const sql = 'SELECT * FROM categories ORDER BY name ASC';
    const rows = await database.all(sql, []);
    return rows.map(row => this.rowToCategory(row));
  }

  async getCategoryById(id) {
    const sql = 'SELECT * FROM categories WHERE id = ?';
    const row = await database.get(sql, [id]);
    return row ? this.rowToCategory(row) : null;
  }

  async createCategory(categoryData) {
    const category = new Category(categoryData);
    const sql = `
      INSERT INTO categories (id, name, description, image, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await database.run(sql, [
      category.id,
      category.name,
      category.description,
      category.image,
      category.createdAt,
      category.updatedAt
    ]);
    return category;
  }

  async updateCategory(id, data) {
    const existingCategory = await this.getCategoryById(id);
    if (!existingCategory) {
      return null;
    }

    const updatedData = {
      id: existingCategory.id,
      name: data.name !== undefined ? data.name : existingCategory.name,
      description: data.description !== undefined ? data.description : existingCategory.description,
      image: data.image !== undefined ? data.image : existingCategory.image,
      createdAt: existingCategory.createdAt,
      updatedAt: new Date().toISOString()
    };

    const updatedCategory = new Category(updatedData);

    const sql = `
      UPDATE categories
      SET name = ?, description = ?, image = ?, updatedAt = ?
      WHERE id = ?
    `;
    await database.run(sql, [
      updatedCategory.name,
      updatedCategory.description,
      updatedCategory.image,
      updatedCategory.updatedAt,
      id
    ]);

    return updatedCategory;
  }

  async deleteCategory(id) {
    const sql = 'DELETE FROM categories WHERE id = ?';
    const result = await database.run(sql, [id]);
    return result.changes > 0;
  }

  async getCategoryByName(name) {
    const sql = 'SELECT * FROM categories WHERE name = ?';
    const row = await database.get(sql, [name]);
    return row ? this.rowToCategory(row) : null;
  }

  async getProductsByCategory(categoryId) {
    const sql = 'SELECT * FROM products WHERE category_id = ?';
    const rows = await database.all(sql, [categoryId]);
    return rows;
  }
}

const categoryStore = new CategoryStore();
module.exports = categoryStore;
