const bcrypt = require('bcryptjs');
const { getConnection } = require('../config/database');

class UserModel {
    static async createUser(userData) {
        const connection = await getConnection();
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const [result] = await connection.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [
                userData.name,
                userData.email,
                hashedPassword,
                userData.role
            ]
        );

        return result.insertId;
    }

    static async findUserByEmail(email) {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        return rows[0];
    }

    static async findUserById(id) {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [id]
        );

        return rows[0];
    }

    static async updateUser(id, userData) {
        const connection = await getConnection();
        const [result] = await connection.execute(
            'UPDATE users SET name = ? WHERE id = ?',
            [userData.name, id]
        );

        return result.affectedRows > 0;
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = UserModel;