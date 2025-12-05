const StockMovementModel = require('../models/stockMovement.model');

exports.getAll = async (req, res) => {
    try {
        const movements = await StockMovementModel.getAllMovements();
        res.json({
            success: true,
            data: movements
        });
    } catch (error) {
        console.error("Error in getAll movements:", error);
        res.status(500).json({
            success: false,
            message: "Помилка при отриманні руху товарів",
            error: error.message
        });
    }
};

exports.getByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const movements = await StockMovementModel.getMovementsByProduct(productId);
        res.json({
            success: true,
            data: movements
        });
    } catch (error) {
        console.error("Error in getByProduct movements:", error);
        res.status(500).json({
            success: false,
            message: "Помилка при отриманні руху товару",
            error: error.message
        });
    }
};

exports.create = async (req, res) => {
    try {
        const { product_id, type, quantity, price, note } = req.body;
        const user_id = req.user.id;

        if (!product_id || !type || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Товар, тип руху та кількість є обов'язковими"
            });
        }

        if (!['in', 'out'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Тип руху має бути 'in' або 'out'"
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Кількість має бути більше 0"
            });
        }

        const movementId = await StockMovementModel.createMovement({
            product_id,
            user_id,
            type,
            quantity: parseInt(quantity),
            price: parseFloat(price) || null,
            note
        });

        const newMovement = await StockMovementModel.getMovementById(movementId);

        res.status(201).json({
            success: true,
            message: type === 'in' ? 'Товар успішно прийнято' : 'Товар успішно видано',
            data: newMovement
        });
    } catch (error) {
        console.error("Error in create movement:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Помилка при створенні руху товару",
            error: error.message
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await StockMovementModel.deleteMovement(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Рух товару не знайдено"
            });
        }

        res.json({
            success: true,
            message: "Рух товару успішно видалено"
        });
    } catch (error) {
        console.error("Error in delete movement:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Помилка при видаленні руху товару",
            error: error.message
        });
    }
};