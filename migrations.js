import sqlite3 from 'sqlite3';

const dbName = 'db.sqlite';

const SQLQueries = {
    // USERS LIST
    user: `
    CREATE TABLE IF NOT EXISTS user
    (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chatId TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE
    )
    `,
    // QUOTE
    task: `
    CREATE TABLE IF NOT EXISTS task
    (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    userId TEXT NOT NULL,
    yesterday TEXT NOT NULL, 
    today TEXT,
    date TEXT NOT NULL
    )
    `,
};

const db = new sqlite3.Database(dbName);

Object.entries(SQLQueries).forEach(async ([name, SQLQuery]) => {
    try {
        console.log('\x1b[34m', name);
        db.run(SQLQuery);
        console.log('\x1b[32m', 'completed');
        console.log('\x1b[0m', '');
    } catch (e) {
        console.log('\x1b[31m', 'error:' + e);
    }
});
db.close();
console.log('\x1b[32m', 'FULL COMPLETED');
console.log('\x1b[0m', '');
