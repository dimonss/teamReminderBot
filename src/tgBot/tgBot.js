import TelegramApi from 'node-telegram-bot-api';
import {
    COMMAND,
    tgBotDisplayCommands,
    exportXlsxOnlyCommands,
} from './constants/tgBotConstants.js';
import TgBotTaskImpl from './implementations/reqest/tgBotTaskImpl.js';
import TgBotUtilsImpl from './implementations/reqest/tgBotUtilsImpl.js';
import { BOT_NAME, BUILD_TYPE, IS_FLUTTER, EXPORT_XLSX_USERS, AVAILABLE_USERS, BOT_TIMEZONE } from "../index.js";
import { BUILD_TYPES } from "../constants.js";
import strings from "../constants/strings.js";
import cron from 'node-cron';
import dailyGroupReport from './schedules/dailyGroupReport.js'
import dailyPublicRemind from "./schedules/dailyPublicRemind.js";
import dailyPrivateRemind from "./schedules/dailyPrivateRemind.js";

const tgBot = (token) => {
    if (!token) return null;
    const bot = new TelegramApi(token, { polling: true });
    bot.setMyCommands(tgBotDisplayCommands).then();
    bot.on('message', async (msg) => {
        const text = msg?.text;
        const task = new TgBotTaskImpl(bot, msg);
        const utils = new TgBotUtilsImpl(bot, msg);

        if (BUILD_TYPE !== BUILD_TYPES.PROD) {
            console.log('msg');
            console.log(msg);
        }

        // Установка персонального меню для пользователей с доступом только к экспорту
        const username = msg?.from?.username;
        const isExportOnlyUser = EXPORT_XLSX_USERS?.includes(username) && !AVAILABLE_USERS?.includes(username);
        if (isExportOnlyUser) {
            bot.setMyCommands(exportXlsxOnlyCommands, {
                scope: { type: 'chat', chat_id: msg.chat.id }
            }).catch(() => { });
        }

        //EXPORT XLSX (доступ для AVAILABLE_USERS + EXPORT_XLSX_USERS)/////////////////////////////////////////////
        if (text === COMMAND.EXPORT_XLSX || text === COMMAND.EXPORT_XLSX + BOT_NAME) {
            if (AVAILABLE_USERS?.includes(username) || EXPORT_XLSX_USERS?.includes(username)) {
                await utils.exportXLSX();
            } else {
                await utils.permissionValidator();
            }
            return;
        }

        //PERMISSION VALIDATOR////////////////////////////////////////////////////////////////////////////////////////////////////
        if (text) {
            if (await utils.permissionValidator()) return;
        }

        // CANCEL EDITING SESSION //////////////////////////////////////////////////////////////////////////////////
        if (text === '/cancel' || text?.toLowerCase() === 'отмена') {
            if (TgBotTaskImpl.hasEditSession(msg.chat.id)) {
                TgBotTaskImpl.clearEditSession(msg.chat.id);
                await bot.sendMessage(msg.chat.id, strings.edit_cancelled);
                return;
            }
        }

        // Clear edit session on any command so user is never trapped in edit mode
        if (text?.startsWith('/')) {
            TgBotTaskImpl.clearEditSession(msg.chat.id);
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
            await dailyGroupReport({
                username: msg?.from?.username || 'withoutUsername',
                message_thread_id: msg?.message_thread_id ? { message_thread_id: msg?.message_thread_id } : {}
            })
            return;
        }
        if (text === COMMAND.REMIND + BOT_NAME) {
            await dailyPublicRemind({
                username: msg?.from?.username || 'withoutUsername',
                message_thread_id: msg?.message_thread_id ? { message_thread_id: msg?.message_thread_id } : {}
            });
            return;
        }
        if (text === COMMAND.REMIND_PRIVATE || text === COMMAND.REMIND_PRIVATE + BOT_NAME) {
            await dailyPrivateRemind({ username: msg?.from?.username || 'withoutUsername' });
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
        if (text === COMMAND.EXPORT_XLSX_MONTH || text === COMMAND.EXPORT_XLSX_MONTH + BOT_NAME) {
            await utils.exportXLSXMonth()
            return
        }
        if (text === COMMAND.EXPORT_XLSX_WEEK || text === COMMAND.EXPORT_XLSX_WEEK + BOT_NAME) {
            await utils.exportXLSXWeek()
            return
        }
        if (text === COMMAND.DELETE_DAILY || text === COMMAND.DELETE_DAILY + BOT_NAME) {
            await task.delete();
            return;
        }
        if (text === COMMAND.EDIT_DAILY || text === COMMAND.EDIT_DAILY + BOT_NAME) {
            await task.edit();
            return;
        }

        //EDIT_TASK MESSAGE///////////////////////////////////////////////////////////////////////////////////////////
        if (TgBotTaskImpl.hasEditSession(msg.chat.id)) {
            const handled = await task.handleEditMessage();
            if (handled) return;
        }

        //ADD_TASK////////////////////////////////////////////////////////////////////////////////////////////////////
        if (text?.length >= 1 && !msg?.reply_to_message) {
            await task.add();
        }

    });

    bot.on('callback_query', async (query) => {
        if (AVAILABLE_USERS.indexOf(query.from?.username) === -1) {
            await bot.answerCallbackQuery(query.id, {
                text: strings.you_do_not_have_access_to_this_bot,
                show_alert: true,
            }).catch(() => {});
            return;
        }
        await TgBotTaskImpl.handleCallback(bot, query);
    });

    if (IS_FLUTTER) {
        console.log("IS_FLUTTER_SCHEDULE");
        cron.schedule('30 17 * * 1-5', dailyPrivateRemind, { timezone: BOT_TIMEZONE })
        cron.schedule('30 17 * * 1-5', dailyPublicRemind, { timezone: BOT_TIMEZONE })
        cron.schedule('15 9 * * 1-5', dailyGroupReport, { timezone: BOT_TIMEZONE })

    }
    else {
        console.log("IS_REGULAR_SCHEDULE");
        cron.schedule('0 9 * * 1-5', dailyPrivateRemind, { timezone: BOT_TIMEZONE })
        //cron.schedule('10 9 * * 1-5', dailyPublicRemind)// turn off dailyPublicRemind
        cron.schedule('15 9 * * 1-5', dailyGroupReport, { timezone: BOT_TIMEZONE })
    }


    return bot
};
export default tgBot;
