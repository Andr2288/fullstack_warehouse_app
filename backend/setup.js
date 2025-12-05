#!/usr/bin/env node

/**
 * Консольний застосунок для управління базою даних
 * Warehouse Management System
 *
 * Використання: node setup.js
 */

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

class DatabaseSetup {
    constructor() {
        this.config = {
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '',
            database: 'warehouse_db',
            multipleStatements: true
        };

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async run() {
        this.clearScreen();
        console.log('=== Налаштування бази даних: Warehouse Management System ===\n');

        while (true) {
            this.showMenu();
            const choice = await this.getInput('Оберіть опцію (1-6): ');

            switch (choice.trim()) {
                case '1':
                    await this.checkDatabase();
                    break;
                case '2':
                    await this.dropDatabase();
                    break;
                case '3':
                    await this.createDatabase();
                    break;
                case '4':
                    await this.fillDatabase();
                    break;
                case '5':
                    await this.fullInitialization();
                    break;
                case '6':
                    console.log('\nДо побачення!');
                    this.rl.close();
                    process.exit(0);
                default:
                    console.log('\nНевірний вибір. Спробуйте ще раз.');
            }

            await this.getInput('\nНатисніть Enter для продовження...');
            this.clearScreen();
        }
    }

    showMenu() {
        console.log('Доступні опції:');
        console.log('1. Перевірити стан бази даних');
        console.log('2. Видалити базу даних');
        console.log('3. Створити базу даних');
        console.log('4. Заповнити тестовими даними');
        console.log('5. Повна ініціалізація (створити + заповнити)');
        console.log('6. Вийти\n');
    }

    async getInput(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, (answer) => {
                resolve(answer);
            });
        });
    }

    clearScreen() {
        console.clear();
        console.log('=== Налаштування бази даних: Warehouse Management System ===\n');
    }

    async getDatabaseConnection(includeDb = true) {
        try {
            const config = { ...this.config };
            if (!includeDb) {
                delete config.database;
            }

            const connection = await mysql.createConnection(config);
            return connection;
        } catch (error) {
            return null;
        }
    }

    async checkDatabase() {
        console.log('\n=== Перевірка стану бази даних ===');

        // Перевірка підключення до MySQL
        process.stdout.write('Перевірка підключення до MySQL...');
        const connection = await this.getDatabaseConnection(false);
        if (!connection) {
            console.log(' ❌ ПОМИЛКА');
            console.log('Не вдалося підключитися до MySQL сервера');
            console.log('Перевірте чи запущений XAMPP/MySQL');
            return;
        }
        console.log(' ✅ OK');

        try {
            // Перевірка існування БД
            process.stdout.write('Перевірка існування БД warehouse_db...');
            const [databases] = await connection.query(
                "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'warehouse_db'"
            );

            if (databases.length === 0) {
                console.log(' ❌ НЕ ІСНУЄ');
                await connection.end();
                return;
            }
            console.log(' ✅ ІСНУЄ');

            // Підключення до БД
            await connection.end();
            process.stdout.write('Підключення до БД warehouse_db...');
            const dbConnection = await this.getDatabaseConnection(true);
            if (!dbConnection) {
                console.log(' ❌ ПОМИЛКА');
                return;
            }
            console.log(' ✅ OK');

            // Перевірка таблиць
            const tables = ['users', 'categories', 'suppliers', 'products', 'stock_movements'];
            console.log('\nПеревірка таблиць:');

            for (const table of tables) {
                process.stdout.write(`  ${table.padEnd(15, ' ')}: `);

                const [tableExists] = await dbConnection.query(`SHOW TABLES LIKE '${table}'`);
                if (tableExists.length > 0) {
                    // Кількість записів
                    const [countResult] = await dbConnection.query(`SELECT COUNT(*) as count FROM \`${table}\``);
                    const count = countResult[0].count;
                    console.log(`✅ існує (${count} записів)`);
                } else {
                    console.log('❌ відсутня');
                }
            }

            await dbConnection.end();

        } catch (error) {
            console.log(` ❌ ПОМИЛКА: ${error.message}`);
            if (connection) await connection.end();
        }
    }

    async dropDatabase() {
        console.log('\n=== Видалення бази даних ===');

        const confirm = await this.getInput('УВАГА! Всі дані будуть втрачені. Продовжити? (y/N): ');
        if (confirm.toLowerCase() !== 'y') {
            console.log('Операцію скасовано.');
            return;
        }

        const connection = await this.getDatabaseConnection(false);
        if (!connection) {
            console.log('❌ Не вдалося підключитися до MySQL');
            return;
        }

        try {
            process.stdout.write('Видалення бази даних...');
            await connection.query('DROP DATABASE IF EXISTS warehouse_db');
            console.log(' ✅ OK');

            console.log('\nБазу даних успішно видалено!');

        } catch (error) {
            console.log(` ❌ ПОМИЛКА: ${error.message}`);
        } finally {
            await connection.end();
        }
    }

    async createDatabase() {
        console.log('\n=== Створення бази даних ===');

        const schemaPath = path.join(__dirname, 'database', 'schema.sql');

        try {
            await fs.access(schemaPath);
        } catch {
            console.log('❌ Файл database/schema.sql не знайдено');
            return;
        }

        const connection = await this.getDatabaseConnection(false);
        if (!connection) {
            console.log('❌ Не вдалося підключитися до MySQL');
            return;
        }

        try {
            process.stdout.write('Читання SQL файлу...');
            const sql = await fs.readFile(schemaPath, 'utf8');
            if (!sql) {
                console.log(' ❌ ПОМИЛКА');
                return;
            }
            console.log(' ✅ OK');

            process.stdout.write('Виконання SQL команд...');

            // Використовуємо multipleStatements для виконання всього SQL разом
            await connection.query(sql);

            console.log(' ✅ OK');
            console.log('\nБазу даних успішно створено!');
            console.log('  ✅ База даних warehouse_db');
            console.log('  ✅ Таблиці (users, categories, suppliers, products, stock_movements)');
            console.log('  ✅ Індекси для оптимізації');

        } catch (error) {
            console.log(` ❌ ПОМИЛКА: ${error.message}`);
            console.log('\nМожливі причини:');
            console.log('- Недостатньо прав користувача MySQL');
            console.log('- База даних вже існує');
            console.log('- Помилка в SQL синтаксисі');
        } finally {
            await connection.end();
        }
    }

    async fillDatabase() {
        console.log('\n=== Заповнення тестовими даними ===');

        const seedPath = path.join(__dirname, 'database', 'seed.sql');

        try {
            await fs.access(seedPath);
        } catch {
            console.log('❌ Файл database/seed.sql не знайдено');
            return;
        }

        const connection = await this.getDatabaseConnection(true);
        if (!connection) {
            console.log('❌ Не вдалося підключитися до БД warehouse_db');
            console.log('Спочатку створіть базу даних (опція 3)');
            return;
        }

        try {
            process.stdout.write('Читання SQL файлу...');
            let sql = await fs.readFile(seedPath, 'utf8');
            if (!sql) {
                console.log(' ❌ ПОМИЛКА');
                return;
            }
            console.log(' ✅ OK');

            // Генеруємо хеш пароля для тестових користувачів
            process.stdout.write('Генерація паролів...');
            const bcrypt = require('bcryptjs');
            const passwordHash = await bcrypt.hash('123456', 10);

            // Замінюємо placeholder на реальний хеш
            sql = sql.replace(/\$2b\$10\$K8jrQJWcZ8vZ2vQJWcZ8vOeKjrQJWcZ8vZ2vQJWcZ8vOeKjrQJWc/g, passwordHash);
            console.log(' ✅ OK');

            process.stdout.write('Додавання тестових даних...');

            // Виконуємо весь SQL разом
            await connection.query(sql);

            console.log(' ✅ OK');
            console.log('\nТестові дані успішно додані!');
            console.log('  ✅ Користувачі: 3 записи');
            console.log('  ✅ Категорії: 5 записів');
            console.log('  ✅ Постачальники: 4 записи');
            console.log('  ✅ Товари: 11 записів');
            console.log('  ✅ Рух товарів: 13 записів');

        } catch (error) {
            console.log(` ❌ ПОМИЛКА: ${error.message}`);
            console.log('\nМожливі причини:');
            console.log('- База даних не існує');
            console.log('- Дані вже додані (дублювання ключів)');
            console.log('- Помилка в SQL синтаксисі');
        } finally {
            await connection.end();
        }
    }

    async fullInitialization() {
        console.log('\n=== Повна ініціалізація ===');
        console.log('Виконується створення БД + заповнення даними...\n');

        await this.createDatabase();
        console.log('\n' + '-'.repeat(50));
        await this.fillDatabase();

        console.log('\n🚀 Повна ініціалізація завершена!');
        console.log('Тепер можете запускати додаток: npm run dev');
        console.log('URL: http://localhost:3000');

        console.log('\n👤 Тестові користувачі:');
        console.log('  admin@warehouse.com / 123456 (Адміністратор)');
        console.log('  manager@warehouse.com / 123456 (Менеджер)');
        console.log('  employee@warehouse.com / 123456 (Співробітник)');
    }
}

// Перевірка чи скрипт запущений безпосередньо
if (require.main === module) {
    const app = new DatabaseSetup();
    app.run().catch(error => {
        console.error('\n❌ Критична помилка:', error.message);
        process.exit(1);
    });
}

module.exports = DatabaseSetup;
