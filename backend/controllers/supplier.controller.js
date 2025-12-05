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
