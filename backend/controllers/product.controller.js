const ProductModel = require('../models/product.model');

exports.getAll = async (req, res) => {
    try {
        const products = await ProductModel.getAllProducts();
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error("Error in getAll products:", error);
        res.status(500).json({
            success: false,
            message: "Помилка при отриманні товарів",
            error: error.message
        });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.getProductById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Товар не знайдено"
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error("Error in getById product:", error);
        res.status(500).json({
            success: false,
            message: "Помилка при отриманні товару",
            error: error.message
        });
    }
};

exports.create = async (req, res) => {
    try {
        const { name, description, category_id, supplier_id, price, stock_quantity, min_stock_level } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Назва товару є обов'язковою"
            });
        }

        const productId = await ProductModel.createProduct({
            name,
            description,
            category_id: category_id || null,
            supplier_id: supplier_id || null,
            price: parseFloat(price) || 0,
            stock_quantity: parseInt(stock_quantity) || 0,
            min_stock_level: parseInt(min_stock_level) || 0
        });

        const newProduct = await ProductModel.getProductById(productId);

        res.status(201).json({
            success: true,
            message: "Товар успішно створено",
            data: newProduct
        });
    } catch (error) {
        console.error("Error in create product:", error);
        res.status(500).json({
            success: false,
            message: "Помилка при створенні товару",
            error: error.message
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category_id, supplier_id, price, stock_quantity, min_stock_level } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Назва товару є обов'язковою"
            });
        }

        const updated = await ProductModel.updateProduct(id, {
            name,
            description,
            category_id: category_id || null,
            supplier_id: supplier_id || null,
            price: parseFloat(price) || 0,
            stock_quantity: parseInt(stock_quantity) || 0,
            min_stock_level: parseInt(min_stock_level) || 0
        });

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Товар не знайдено"
            });
        }

        const updatedProduct = await ProductModel.getProductById(id);

        res.json({
            success: true,
            message: "Товар успішно оновлено",
            data: updatedProduct
        });
    } catch (error) {
        console.error("Error in update product:", error);
        res.status(500).json({
            success: false,
            message: "Помилка при оновленні товару",
            error: error.message
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await ProductModel.deleteProduct(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Товар не знайдено"
            });
        }

        res.json({
            success: true,
            message: "Товар успішно видалено"
        });
    } catch (error) {
        console.error("Error in delete product:", error);
        
        if (error.message.includes('історією руху')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Помилка при видаленні товару",
            error: error.message
        });
    }
};

exports.getLowStock = async (req, res) => {
    try {
        const products = await ProductModel.getLowStockProducts();
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error("Error in getLowStock:", error);
        res.status(500).json({
            success: false,
            message: "Помилка при отриманні товарів з малими залишками",
            error: error.message
        });
    }
};
