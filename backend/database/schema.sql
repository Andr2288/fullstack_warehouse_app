-- Warehouse Management Database Schema
-- Для XAMPP MySQL

DROP DATABASE IF EXISTS warehouse_db;
CREATE DATABASE warehouse_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE warehouse_db;

-- Користувачі
CREATE TABLE users (
                       id INT PRIMARY KEY AUTO_INCREMENT,
                       name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       role ENUM('admin', 'manager', 'employee') DEFAULT 'employee',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Категорії товарів
CREATE TABLE categories (
                            id INT PRIMARY KEY AUTO_INCREMENT,
                            name VARCHAR(255) NOT NULL,
                            description TEXT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Постачальники
CREATE TABLE suppliers (
                           id INT PRIMARY KEY AUTO_INCREMENT,
                           name VARCHAR(255) NOT NULL,
                           contact_person VARCHAR(255),
                           phone VARCHAR(50),
                           email VARCHAR(255),
                           address TEXT,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Товари
CREATE TABLE products (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          name VARCHAR(255) NOT NULL,
                          description TEXT,
                          category_id INT,
                          supplier_id INT,
                          price DECIMAL(10, 2),
                          stock_quantity INT DEFAULT 0,
                          min_stock_level INT DEFAULT 0,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          FOREIGN KEY (category_id) REFERENCES categories(id),
                          FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Рух товарів на складі
CREATE TABLE stock_movements (
                                 id INT PRIMARY KEY AUTO_INCREMENT,
                                 product_id INT NOT NULL,
                                 user_id INT NOT NULL,
                                 type ENUM('in', 'out') NOT NULL,
                                 quantity INT NOT NULL,
                                 price DECIMAL(10, 2),
                                 note TEXT,
                                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                 FOREIGN KEY (product_id) REFERENCES products(id),
                                 FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Індекси для оптимізації
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_date ON stock_movements(created_at);