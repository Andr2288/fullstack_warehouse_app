const { getConnection } = require('../config/database');

class StockMovementModel {
    static async getAllMovements() {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT 
                sm.*,
                p.name as product_name,
                u.name as user_name
            FROM stock_movements sm
            LEFT JOIN products p ON sm.product_id = p.id
            LEFT JOIN users u ON sm.user_id = u.id
            ORDER BY sm.created_at DESC
        `);
        return rows;
    }

    static async getMovementsByProduct(productId) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT 
                sm.*,
                u.name as user_name
            FROM stock_movements sm
            LEFT JOIN users u ON sm.user_id = u.id
            WHERE sm.product_id = ?
            ORDER BY sm.created_at DESC
        `, [productId]);
        return rows;
    }

    static async createMovement(movementData) {
        const connection = await getConnection();
        
        // Починаємо транзакцію
        await connection.beginTransaction();
        
        try {
            // Створюємо запис руху
            const [result] = await connection.execute(
                'INSERT INTO stock_movements (product_id, user_id, type, quantity, price, note) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    movementData.product_id,
                    movementData.user_id,
                    movementData.type,
                    movementData.quantity,
                    movementData.price || null,
                    movementData.note || null
                ]
            );

            // Оновлюємо кількість товару на складі
            if (movementData.type === 'in') {
                await connection.execute(
                    'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
                    [movementData.quantity, movementData.product_id]
                );
            } else if (movementData.type === 'out') {
                // Перевіряємо чи достатньо товару
                const [product] = await connection.execute(
                    'SELECT stock_quantity FROM products WHERE id = ?',
                    [movementData.product_id]
                );
                
                if (product[0].stock_quantity < movementData.quantity) {
                    throw new Error('Недостатньо товару на складі');
                }
                
                await connection.execute(
                    'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                    [movementData.quantity, movementData.product_id]
                );
            }

            await connection.commit();
            return result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    }

    static async getMovementById(id) {
        const connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT 
                sm.*,
                p.name as product_name,
                u.name as user_name
            FROM stock_movements sm
            LEFT JOIN products p ON sm.product_id = p.id
            LEFT JOIN users u ON sm.user_id = u.id
            WHERE sm.id = ?
        `, [id]);
        return rows[0];
    }

    static async deleteMovement(id) {
        const connection = await getConnection();
        
        await connection.beginTransaction();
        
        try {
            // Отримуємо дані руху
            const [movement] = await connection.execute(
                'SELECT * FROM stock_movements WHERE id = ?',
                [id]
            );
            
            if (movement.length === 0) {
                throw new Error('Рух товару не знайдено');
            }

            const mov = movement[0];

            // Повертаємо кількість назад
            if (mov.type === 'in') {
                await connection.execute(
                    'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                    [mov.quantity, mov.product_id]
                );
            } else if (mov.type === 'out') {
                await connection.execute(
                    'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
                    [mov.quantity, mov.product_id]
                );
            }

            // Видаляємо запис
            const [result] = await connection.execute(
                'DELETE FROM stock_movements WHERE id = ?',
                [id]
            );

            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    }
}

module.exports = StockMovementModel;