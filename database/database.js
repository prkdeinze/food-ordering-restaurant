const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "prk.sqlite");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
              email TEXT NOT NULL UNIQUE,
                  passwordHash TEXT NOT NULL,
                      salt TEXT NOT NULL,
                          role TEXT NOT NULL DEFAULT 'customer',
                              createdAt TEXT NOT NULL
                                )
                                `);

                                module.exports = db;