import TelegramApi from 'node-telegram-bot-api';
import {COMMAND, tgBotDisplayCommands} from './constants/tgBotConstants.js';
import TgBotTaskImpl from './implementations/reqest/tgBotTaskImpl.js';
import TgBotUtilsImpl from './implementations/reqest/tgBotUtilsImpl.js';
import {BOT_NAME, BUILD_TYPE} from "../index.js";
import {BUILD_TYPES} from "../constants.js";
import cron from 'node-cron';
import dailyGroupReport from './schedules/dailyGroupReport.js'
import dailyPublicRemind from "./schedules/dailyPublicRemind.js";
import dailyPrivateRemind from "./schedules/dailyPrivatRemind.js";

const tgBot = (token) => {
    const bot = new TelegramApi(token, {polling: true});
    bot.setMyCommands(tgBotDisplayCommands).then();
    bot.on('message', async (msg) => {
        const text = msg?.text;
        const task = new TgBotTaskImpl(bot, msg);
        const utils = new TgBotUtilsImpl(bot, msg);
        if (BUILD_TYPE !== BUILD_TYPES.PROD) {
            console.log('msg');
            console.log(msg);
        }

        //PERMISSION VALIDATOR////////////////////////////////////////////////////////////////////////////////////////////////////
        if (text) {
            if (await utils.permissionValidator()) return;
        }

        //COMMON////////////////////////////////////////////////////////////////////////////////////////////////////
        if (text === COMMAND.START) {
            await utils.start();
            return;
        }
        if (text === COMMAND.START + BOT_NAME) {
            await utils.startForGroup();
            return;
        }
        if (text === COMMAND.INFO) {
            await utils.info()
            return;
        }
        if (text === COMMAND.INFO + BOT_NAME) {
            await dailyGroupReport()
            return;
        }
        if (text === COMMAND.REMIND + BOT_NAME) {
            await dailyPublicRemind(msg?.from?.username);
            return;
        }
        //QUOTES////////////////////////////////////////////////////////////////////////////////////////////////////
        if (text?.length >= 1) {
            await task.add();
        }

    });

    cron.schedule('0 9 * * 1-5', dailyPrivateRemind)
    cron.schedule('10 9 * * 1-5', dailyPublicRemind)
    cron.schedule('15 9 * * 1-5', dailyGroupReport)
    return bot
};
export default tgBot;
