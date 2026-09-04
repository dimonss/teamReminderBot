import sqlite3 from 'sqlite3';
import {getCurrentDate} from "../utils/commonUtils.js";


sqlite3.verbose();
const dbName = 'db.sqlite';
const db = new sqlite3.Database(dbName);

class TaskSQL {
    static all(cb) {
        db.all(`SELECT * FROM task`, cb);
    }

    static allToday(cb) {
        db.all(`SELECT * FROM task WHERE date = "${getCurrentDate()}"`, cb);
    }

    static getTodayReport(userId, cb) {
        db.get(`SELECT * FROM task WHERE (userId = "${userId}" AND date = "${getCurrentDate()}")`, cb);
    }

    static createYesterdayTask(data, cb) {
        const sql =
            'INSERT INTO task(userId, yesterday, date) VALUES (?,?,?)';
        db.run(
            sql,
            data.userId,
            data.text,
            getCurrentDate(),
            cb,
        );
    }
    static createTodayTask(data, cb) {
        const sql =
            'UPDATE task SET today = ? WHERE (userId = ? AND date = ?)';
        db.run(
            sql,
            data.text,
            data.userId,
            data.date,
            cb,
        );
    }

    static updateYesterdayTask(data, cb) {
        const sql =
            'UPDATE task SET yesterday = ? WHERE (userId = ? AND date = ?)';
        db.run(
            sql,
            data.text,
            data.userId,
            data.date || getCurrentDate(),
            cb,
        );
    }

    static updateTodayTask(data, cb) {
        const sql =
            'UPDATE task SET today = ? WHERE (userId = ? AND date = ?)';
        db.run(
            sql,
            data.text,
            data.userId,
            data.date || getCurrentDate(),
            cb,
        );
    }

    static updateBothTask(data, cb) {
        const sql =
            'UPDATE task SET yesterday = ?, today = ? WHERE (userId = ? AND date = ?)';
        db.run(
            sql,
            data.yesterday,
            data.today,
            data.userId,
            data.date || getCurrentDate(),
            cb,
        );
    }

    static updateTask(data, cb) {
        const sql =
            'UPDATE task SET today = ?, yesterday = ? WHERE (userId = ? AND date = ?)';
        db.run(
            sql,
            data.textToday,
            data.yesterday,
            data.userId,
            data.date || getCurrentDate(),
            cb,
        );
    }

    static deleteTodayTask(userId, cb) {
        const sql = 'DELETE FROM task WHERE userId = ? AND date = ?';
        db.run(sql, userId, getCurrentDate(), cb);
    }
}

export default TaskSQL;
