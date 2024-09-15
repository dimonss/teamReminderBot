import express from 'express';
import TaskSQL from './db/taskSQL.js';
import {commonDto} from './DTO/common.js';
import {STATUS} from './constants.js';
import tgBot from './tgBot/tgBot.js';
import {checkAuth} from './utils/commonUtils.js';
import dotenv from 'dotenv';
import UserSQL from "./db/userSQL.js";

dotenv.config();

const HOSTNAME = process.env.HOSTNAME;
export const TG_TOKEN = process.env.TG_TOKEN;
export const AUTH = process.env.AUTH;
export const BOT_NAME = process.env.BOT_NAME;
export const BUILD_TYPE = process.env.BUILD_TYPE;
export const AVAILABLE_USERS = process.env.AVAILABLE_USERS?.split("|");
export const AVAILABLE_USERS_NAMES = process.env.AVAILABLE_USERS_NAMES?.split("|");
export const GROUP_CHAT_ID = process.env.GROUP_CHAT_ID;
const PORT = process.env.PORT || 4000;

const app = express();
export const bot = tgBot(TG_TOKEN);
const startApp = async () => {
    try {
        app.listen(PORT, HOSTNAME, () => {
            console.log(`Server started on ${PORT} port`);
        });
    } catch (e) {
        console.log('e');
        console.log(e);
    }
    app.use(express.json());
    app.use((req, res, next) => {
        res.append('Access-Control-Allow-Origin', ['*']);
        res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
        res.append('Access-Control-Allow-Headers', 'Content-Type,Auth,auth');
        next();
    });

    //get all tasks/////////////////////////////////////////////;

    app.get('/get_all_tasks', (req, res, next) => {
        if (checkAuth(req, res)) {
            TaskSQL.all(
                (error, tasks) => {
                    if (error) return next(error);
                    UserSQL.all(
                        (error, users) => {
                            if (error) return next(error);
                            const data = tasks.map(item => ({
                                ...item,
                                userCyrillicName: users.find(user => user.id === Number(item.userId))?.cyrillicName
                            }))
                            res.json(commonDto(STATUS.OK, 'success', data));
                        },
                    );
                },
            );
        }
    });
    app.get('/get_all_users', (req, res, next) => {
        if (checkAuth(req, res)) {
            UserSQL.all(
                (error, users) => {
                    if (error) return next(error);
                    res.json(commonDto(STATUS.OK, 'success', users));
                },
            );
        }
    });
    app.get('/get_today_tasks', (req, res, next) => {
        if (checkAuth(req, res)) {
            TaskSQL.allToday(
                (error, tasks) => {
                    if (error) return next(error);
                    UserSQL.all(
                        (error, users) => {
                            if (error) return next(error);
                            const data = tasks.map(item => ({
                                ...item,
                                userCyrillicName: users.find(user => user.id === Number(item.userId))?.cyrillicName
                            }))
                            res.json(commonDto(STATUS.OK, 'success', data));
                        },
                    );
                },
            );
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
};

startApp();
