const { getConnection } = require('../config/database');

class CategoryModel {
    static async getAllCategories() {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM categories ORDER BY name'
        );
        return rows;
    }

    static async getCategoryById(id) {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM categories WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async createCategory(categoryData) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'INSERT INTO categories (name, description) VALUES (?, ?)',
            [categoryData.name, categoryData.description || null]
        );
        return result.insertId;
    }

    static async updateCategory(id, categoryData) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'UPDATE categories SET name = ?, description = ? WHERE id = ?',
            [categoryData.name, categoryData.description || null, id]
        );
        return result.affectedRows > 0;
    }

    static async deleteCategory(id) {
        const connection = await getConnection();
        
        // Перевіряємо чи немає товарів в цій категорії
        const [products] = await connection.execute(
            'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
            [id]
        );
        
        if (products[0].count > 0) {
            throw new Error('Неможливо видалити категорію з товарами');
        }

        const [result] = await connection.execute(
            'DELETE FROM categories WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = CategoryModel;
