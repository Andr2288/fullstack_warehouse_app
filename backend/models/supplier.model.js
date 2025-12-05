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
}

module.exports = SupplierModel;
