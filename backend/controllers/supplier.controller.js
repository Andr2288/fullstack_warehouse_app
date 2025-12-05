const SupplierModel = require('../models/supplier.model');

exports.getAll = async (req, res) => {
    try {
        const suppliers = await SupplierModel.getAllSuppliers();
        res.json({
            success: true,
            data: suppliers
        });
    } catch (error) {
        console.error("Error in getAll suppliers:", error);
        res.status(500).json({
            success: false,
            message: "Помилка при отриманні постачальників",
            error: error.message
        });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await SupplierModel.getSupplierById(id);

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Постачальника не знайдено"
            });
        }

        res.json({
            success: true,
            data: supplier
        });
    } catch (error) {
        console.error("Error in getById supplier:", error);
        res.status(500).json({
            success: false,
            message: "Помилка при отриманні постачальника",
            error: error.message
        });
    }
};

exports.create = async (req, res) => {
    try {
        const { name, contact_person, phone, email, address } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Назва постачальника є обов'язковою"
            });
        }

        const supplierId = await SupplierModel.createSupplier({
            name,
            contact_person,
            phone,
            email,
            address
        });

        const newSupplier = await SupplierModel.getSupplierById(supplierId);

        res.status(201).json({
            success: true,
            message: "Постачальника успішно створено",
            data: newSupplier
        });
    } catch (error) {
        console.error("Error in create supplier:", error);
        res.status(500).json({
            success: false,
            message: "Помилка при створенні постачальника",
            error: error.message
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, contact_person, phone, email, address } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Назва постачальника є обов'язковою"
            });
        }

        const updated = await SupplierModel.updateSupplier(id, {
            name,
            contact_person,
            phone,
            email,
            address
        });

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Постачальника не знайдено"
            });
        }

        const updatedSupplier = await SupplierModel.getSupplierById(id);

        res.json({
            success: true,
            message: "Постачальника успішно оновлено",
            data: updatedSupplier
        });
    } catch (error) {
        console.error("Error in update supplier:", error);
        res.status(500).json({
            success: false,
            message: "Помилка при оновленні постачальника",
            error: error.message
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await SupplierModel.deleteSupplier(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Постачальника не знайдено"
            });
        }

        res.json({
            success: true,
            message: "Постачальника успішно видалено"
        });
    } catch (error) {
        console.error("Error in delete supplier:", error);

        if (error.message.includes('товарами')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Помилка при видаленні постачальника",
            error: error.message
        });
    }
};