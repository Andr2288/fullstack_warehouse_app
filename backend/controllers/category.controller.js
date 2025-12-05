const CategoryModel = require('../models/category.model');

exports.getAll = async (req, res) => {
    try {
        const categories = await CategoryModel.getAllCategories();
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error("Error in getAll categories:", error);
        res.status(500).json({
            success: false,
            message: "Помилка при отриманні категорій",
            error: error.message
        });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.getCategoryById(id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Категорію не знайдено"
            });
        }

        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error("Error in getById category:", error);
        res.status(500).json({
            success: false,
            message: "Помилка при отриманні категорії",
            error: error.message
        });
    }
};

exports.create = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Назва категорії є обов'язковою"
            });
        }

        const categoryId = await CategoryModel.createCategory({
            name,
            description
        });

        const newCategory = await CategoryModel.getCategoryById(categoryId);

        res.status(201).json({
            success: true,
            message: "Категорію успішно створено",
            data: newCategory
        });
    } catch (error) {
        console.error("Error in create category:", error);
        res.status(500).json({
            success: false,
            message: "Помилка при створенні категорії",
            error: error.message
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Назва категорії є обов'язковою"
            });
        }

        const updated = await CategoryModel.updateCategory(id, {
            name,
            description
        });

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Категорію не знайдено"
            });
        }

        const updatedCategory = await CategoryModel.getCategoryById(id);

        res.json({
            success: true,
            message: "Категорію успішно оновлено",
            data: updatedCategory
        });
    } catch (error) {
        console.error("Error in update category:", error);
        res.status(500).json({
            success: false,
            message: "Помилка при оновленні категорії",
            error: error.message
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await CategoryModel.deleteCategory(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Категорію не знайдено"
            });
        }

        res.json({
            success: true,
            message: "Категорію успішно видалено"
        });
    } catch (error) {
        console.error("Error in delete category:", error);
        
        if (error.message.includes('товарами')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Помилка при видаленні категорії",
            error: error.message
        });
    }
};
