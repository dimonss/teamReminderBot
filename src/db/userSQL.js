import sqlite3 from 'sqlite3';

sqlite3.verbose();
const dbName = 'db.sqlite';
const db = new sqlite3.Database(dbName);

class UserSQL {
    static userExist(username, cb) {
        db.get(`SELECT id FROM user WHERE name = "${username}"`, cb);
    }
    static getUser(userId, cb) {
        db.get(`SELECT * FROM user WHERE id = "${userId}"`, cb);
    }

    static add(chatId, username, cb) {
        db.run(`INSERT INTO user (chatId, name) VALUES ("${chatId}", "${username}")`, cb);
    }
    static all(cb) {
        db.all('SELECT * FROM user', cb);
    }
    static getChatIdByUsername(username, cb) {
        db.get(`SELECT chatId FROM user WHERE name = "${username}"`, cb);
    }
    static find(id, cb) {
        db.get('SELECT * FROM chatId WHERE id = ?', id, cb);
    }
    static findByChatId(id, cb) {
        db.get('SELECT * FROM user WHERE name = ?', id, cb);
    }
}

export default UserSQL;
