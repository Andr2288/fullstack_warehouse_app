const { getConnection } = require('../config/database');

class SupplierModel {
    static async getAllSuppliers() {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM suppliers ORDER BY name'
        );
        return rows;
    }

    static async getSupplierById(id) {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM suppliers WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async createSupplier(supplierData) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES (?, ?, ?, ?, ?)',
            [
                supplierData.name,
                supplierData.contact_person || null,
                supplierData.phone || null,
                supplierData.email || null,
                supplierData.address || null
            ]
        );
        return result.insertId;
    }

    static async updateSupplier(id, supplierData) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'UPDATE suppliers SET name = ?, contact_person = ?, phone = ?, email = ?, address = ? WHERE id = ?',
            [
                supplierData.name,
                supplierData.contact_person || null,
                supplierData.phone || null,
                supplierData.email || null,
                supplierData.address || null,
                id
            ]
        );
        return result.affectedRows > 0;
    }

    static async deleteSupplier(id) {
        const connection = await getConnection();

        // Перевіряємо чи немає товарів від цього постачальника
        const [products] = await connection.execute(
            'SELECT COUNT(*) as count FROM products WHERE supplier_id = ?',
            [id]
        );

        if (products[0].count > 0) {
            throw new Error('Неможливо видалити постачальника з товарами');
        }

        const [result] = await connection.execute(
            'DELETE FROM suppliers WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = SupplierModel;