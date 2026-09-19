const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'supplier-commerce.sqlite');
const supplierDb = new Database(dbPath);

supplierDb.pragma('journal_mode = WAL');
supplierDb.pragma('foreign_keys = ON');

module.exports = supplierDb;
