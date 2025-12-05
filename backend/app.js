const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const supplierRoutes = require('./routes/suppliers');
const stockMovementRoutes = require('./routes/stockMovements');
const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/stock-movements', stockMovementRoutes);

// Головна сторінка
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Warehouse Management API',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            categories: '/api/categories',
            suppliers: '/api/suppliers',
            stockMovements: '/api/stock-movements'
        }
    });
});

// Error handling middleware
function errorMiddleware(err, req, res, next) {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Внутрішня помилка сервера'
    });
}

app.use(errorMiddleware);

// Підключення до БД та запуск сервера
async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Сервер запущено на порті ${PORT}`);
            console.log(`http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Помилка запуску сервера:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;