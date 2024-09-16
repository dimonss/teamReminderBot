import TelegramApi from 'node-telegram-bot-api';
import {COMMAND, tgBotDisplayCommands} from './constants/tgBotConstants.js';
import TgBotTaskImpl from './implementations/reqest/tgBotTaskImpl.js';
import TgBotUtilsImpl from './implementations/reqest/tgBotUtilsImpl.js';
import {BOT_NAME, BUILD_TYPE} from "../index.js";
import {BUILD_TYPES} from "../constants.js";
import cron from 'node-cron';
import dailyGroupReport from './schedules/dailyGroupReport.js'
import dailyPublicRemind from "./schedules/dailyPublicRemind.js";
import dailyPrivateRemind from "./schedules/dailyPrivateRemind.js";

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
            await dailyGroupReport({username: msg?.from?.username || 'withoutUsername'})
            return;
        }
        if (text === COMMAND.REMIND + BOT_NAME) {
            await dailyPublicRemind({username: msg?.from?.username || 'withoutUsername'});
            return;
        }
        if (text === COMMAND.REMIND_PRIVATE || text === COMMAND.REMIND_PRIVATE + BOT_NAME) {
            await dailyPrivateRemind({username: msg?.from?.username || 'withoutUsername'});
            return;
        }
        if (text === COMMAND.CHAT_ID || text === COMMAND.CHAT_ID + BOT_NAME) {
            await utils.getChatId()
            return
        }
        if (text === COMMAND.TEG_ALL || text === COMMAND.TEG_ALL + BOT_NAME) {
            await utils.tegAll()
            return
        }
        if (text === COMMAND.BUG_ON_PRE_PROD || text === COMMAND.BUG_ON_PRE_PROD + BOT_NAME) {
            await utils.bugOnPreProd()
            return
        }
        if (text === COMMAND.BUG_ON_PROD || text === COMMAND.BUG_ON_PROD + BOT_NAME) {
            await utils.bugOnProd()
            return
        }
        if (text === COMMAND.EXPORT_XLSX || text === COMMAND.EXPORT_XLSX + BOT_NAME) {
            await utils.exportXLSX()
            return
        }
        //ADD_TASK////////////////////////////////////////////////////////////////////////////////////////////////////
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
