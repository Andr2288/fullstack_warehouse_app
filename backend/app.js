const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const supplierRoutes = require('./routes/suppliers');
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

// Головна сторінка
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Dashboard
app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Categories page
app.get('/categories.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'categories.html'));
});

// Products page
app.get('/products.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'products.html'));
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