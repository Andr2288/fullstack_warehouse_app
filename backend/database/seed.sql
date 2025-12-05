-- Тестові дані для warehouse_db
USE warehouse_db;

-- Очистка таблиць
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE stock_movements;
TRUNCATE TABLE products;
TRUNCATE TABLE suppliers;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Користувачі (пароль: 123456)
INSERT INTO users (name, email, password, role) VALUES
                                                    ('Адміністратор', 'admin@warehouse.com', '$2b$10$K8jrQJWcZ8vZ2vQJWcZ8vOeKjrQJWcZ8vZ2vQJWcZ8vOeKjrQJWc', 'admin'),
                                                    ('Менеджер Петро', 'manager@warehouse.com', '$2b$10$K8jrQJWcZ8vZ2vQJWcZ8vOeKjrQJWcZ8vZ2vQJWcZ8vOeKjrQJWc', 'manager'),
                                                    ('Співробітник Марія', 'employee@warehouse.com', '$2b$10$K8jrQJWcZ8vZ2vQJWcZ8vZ2vQJWcZ8vOeKjrQJWc', 'employee');

-- Категорії
INSERT INTO categories (name, description) VALUES
    ('Електроніка', 'Комп\'ютери, телефони, планшети'),
('Меблі', 'Офісні та домашні меблі'),
('Канцелярія', 'Папір, ручки, степлери'),
('Інструменти', 'Ручні та електричні інструменти'),
('Матеріали', 'Будівельні та виробничі матеріали');

-- Постачальники
INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES
('ТехноСвіт', 'Іванов Іван', '+380501234567', 'info@technoworld.ua', 'м. Київ, вул. Технічна 15'),
('МебліПлюс', 'Петренко Ольга', '+380671234567', 'sales@mebliplus.ua', 'м. Львів, вул. Меблева 22'),
('ОфісТорг', 'Сидоренко Микола', '+380931234567', 'office@ofistorg.ua', 'м. Харків, вул. Офісна 8'),
('ІнструментБуд', 'Коваленко Світлана', '+380991234567', 'tools@instrumentbud.ua', 'м. Дніпро, вул. Будівельна 45');

-- Товари
INSERT INTO products (name, description, category_id, supplier_id, price, stock_quantity, min_stock_level) VALUES
-- Електроніка
('Ноутбук Lenovo', 'Ноутбук для офісної роботи', 1, 1, 25000.00, 5, 2),
('Монітор Samsung 24"', 'LED монітор для робочого місця', 1, 1, 8500.00, 12, 3),
('Клавіатура бездротова', 'Bluetooth клавіатура', 1, 1, 1200.00, 25, 5),

-- Меблі
     ('Стіл офісний', 'Стіл для комп\'ютера 120x60см', 2, 2, 4500.00, 8, 2),
('Крісло офісне', 'Ергономічне крісло з підлокітниками', 2, 2, 6500.00, 15, 3),
('Шафа для документів', 'Металева шафа з замком', 2, 2, 8900.00, 4, 1),

-- Канцелярія
('Папір А4', 'Білий папір для друку, 500 аркушів', 3, 3, 180.00, 50, 10),
('Ручка кулькова синя', 'Одноразова ручка', 3, 3, 15.00, 200, 50),
('Степлер', 'Металевий степлер №10', 3, 3, 85.00, 20, 5),

-- Інструменти
('Дриль електричний', 'Ударний дриль 600Вт', 4, 4, 2800.00, 6, 2),
('Набір викруток', 'Викрутки хрестові та плоскі 12шт', 4, 4, 450.00, 15, 3);