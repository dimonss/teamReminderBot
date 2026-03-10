import sqlite3 from 'sqlite3';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

/**
 * Standalone script to export XLSX from any SQLite database.
 *
 * Usage:
 *   node --experimental-modules src/utils/exportXLSXFromDB.js <dbName>
 *
 * Example:
 *   node src/utils/exportXLSXFromDB.js db.sqlite
 *   node src/utils/exportXLSXFromDB.js designerdb.sqlite
 */

const dbName = process.argv[2];

if (!dbName) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: Please provide a database name as an argument.');
    console.log('Usage: node src/utils/exportXLSXFromDB.js <dbName>');
    console.log('Example: node src/utils/exportXLSXFromDB.js db.sqlite');
    process.exit(1);
}

if (!fs.existsSync(dbName)) {
    console.error('\x1b[31m%s\x1b[0m', `Error: Database file "${dbName}" not found.`);
    process.exit(1);
}

const db = new sqlite3.Database(dbName);

const getAllRows = (query) =>
    new Promise((resolve, reject) => {
        db.all(query, (error, rows) => {
            if (error) reject(error);
            else resolve(rows);
        });
    });

const getCurrentDate = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
};

(async () => {
    try {
        console.log('\x1b[34m%s\x1b[0m', `Reading database: ${dbName}`);

        const tasks = await getAllRows('SELECT * FROM task');
        const users = await getAllRows('SELECT * FROM user');

        console.log(`Found ${tasks.length} tasks and ${users.length} users.`);

        const data = tasks.map((item) => ({
            ...item,
            userCyrillicName:
                users.find((user) => user.id === Number(item.userId))?.cyrillicName || '',
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users and Tasks');

        const baseName = path.basename(dbName, path.extname(dbName));
        const filePath = `${baseName}_tasks_${getCurrentDate()}.xlsx`;

        XLSX.writeFile(workbook, filePath);

        console.log('\x1b[32m%s\x1b[0m', `XLSX file successfully created: ${filePath}`);
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'Error:', error.message);
        process.exit(1);
    } finally {
        db.close();
    }
})();
