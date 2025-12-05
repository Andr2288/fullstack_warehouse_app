const { getConnection } = require('../config/database');

class ProductModel {
    static async getAllProducts() {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT p.*, c.name as category_name, s.name as supplier_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            ORDER BY p.name
        `);
        return rows;
    }

    static async getProductById(id) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT p.*, c.name as category_name, s.name as supplier_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            WHERE p.id = ?
        `, [id]);
        return rows[0];
    }

    static async createProduct(productData) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            `INSERT INTO products (name, description, category_id, supplier_id, price, stock_quantity, min_stock_level) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                productData.name,
                productData.description || null,
                productData.category_id || null,
                productData.supplier_id || null,
                productData.price || 0,
                productData.stock_quantity || 0,
                productData.min_stock_level || 0
            ]
        );
        return result.insertId;
    }

    static async updateProduct(id, productData) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            `UPDATE products 
             SET name = ?, description = ?, category_id = ?, supplier_id = ?, 
                 price = ?, stock_quantity = ?, min_stock_level = ?
             WHERE id = ?`,
            [
                productData.name,
                productData.description || null,
                productData.category_id || null,
                productData.supplier_id || null,
                productData.price || 0,
                productData.stock_quantity || 0,
                productData.min_stock_level || 0,
                id
            ]
        );
        return result.affectedRows > 0;
    }

    static async deleteProduct(id) {
        const connection = await getConnection();
        
        // Перевіряємо чи немає руху товарів
        const [movements] = await connection.execute(
            'SELECT COUNT(*) as count FROM stock_movements WHERE product_id = ?',
            [id]
        );
        
        if (movements[0].count > 0) {
            throw new Error('Неможливо видалити товар з історією руху');
        }

        const [result] = await connection.execute(
            'DELETE FROM products WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async getLowStockProducts() {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT p.*, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.stock_quantity <= p.min_stock_level
            ORDER BY p.name
        `);
        return rows;
    }
}

module.exports = ProductModel;
