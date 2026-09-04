import TaskSQL from '../../../db/taskSQL.js';
import UserSQL from "../../../db/userSQL.js";
import taskSQL from "../../../db/taskSQL.js";
import strings from "../../../constants/strings.js";
import {genRandomErrorMessageForCompletedDaily} from "../../../utils/rangomStringsUtils.js";
import {isGroupReportTimePassed} from "../../../utils/commonUtils.js";
import {CALLBACK_ACTIONS} from "../../constants/tgBotConstants.js";

const editSessions = new Map();

export const getDailyActionButtons = () => ({
    reply_markup: {
        inline_keyboard: [
            [
                { text: '✏️ Редактировать', callback_data: CALLBACK_ACTIONS.EDIT_DAILY },
                { text: '🗑 Удалить', callback_data: CALLBACK_ACTIONS.DELETE_DAILY },
            ]
        ]
    }
});

export const getEditChoiceButtons = () => ({
    reply_markup: {
        inline_keyboard: [
            [
                { text: '1️⃣ Что делал', callback_data: CALLBACK_ACTIONS.EDIT_YESTERDAY },
                { text: '2️⃣ Что буду делать', callback_data: CALLBACK_ACTIONS.EDIT_TODAY },
            ],
            [
                { text: '🔄 Весь дейлик', callback_data: CALLBACK_ACTIONS.EDIT_BOTH },
                { text: '❌ Отмена', callback_data: CALLBACK_ACTIONS.EDIT_CANCEL },
            ]
        ]
    }
});

export const getCancelButton = () => ({
    reply_markup: {
        inline_keyboard: [
            [
                { text: '❌ Отмена', callback_data: CALLBACK_ACTIONS.EDIT_CANCEL },
            ]
        ]
    }
});

class TgBotTaskImpl {
    constructor(bot, msg) {
        this.bot = bot;
        this.chatId = msg?.chat?.id;
        this.text = msg?.text;
        this.username = msg?.from?.username;
    }

    static hasEditSession(chatId) {
        return editSessions.has(chatId);
    }

    static clearEditSession(chatId) {
        return editSessions.delete(chatId);
    }

    async add() {
        try {
            const addQuote = () => {
                UserSQL.userExist(this.username, async (error, userExistData) => {
                    if (userExistData?.id) {
                        TaskSQL.getTodayReport(userExistData.id, async (error, yesterdayTextExistData) => {
                            if (error) {
                                await this.bot.sendMessage(
                                    this.chatId,
                                    strings.ups,
                                );
                            } else {
                                if (!!yesterdayTextExistData?.today) {
                                    if (isGroupReportTimePassed()) {
                                        await this.bot.sendMessage(
                                            this.chatId,
                                            genRandomErrorMessageForCompletedDaily(),
                                        );
                                    } else {
                                        await this.bot.sendMessage(
                                            this.chatId,
                                            strings.daily_already_submitted_with_actions,
                                            getDailyActionButtons(),
                                        );
                                    }
                                    return;
                                }
                                if (yesterdayTextExistData?.id) {
                                    if (this.text.length < 9) {
                                        await this.bot.sendMessage(
                                            this.chatId,
                                            strings.soLittle,
                                        );
                                        return;
                                    }
                                    if (this.text.length > 560) {
                                        await this.bot.sendMessage(
                                            this.chatId,
                                            strings.soLong,
                                        );
                                        return;
                                    }
                                    taskSQL.createTodayTask({text: this.text, userId: yesterdayTextExistData?.userId, date: yesterdayTextExistData.date}, async (error) => {
                                        if (!error) {
                                            await this.bot.sendMessage(
                                                this.chatId,
                                                strings.super_your_daily_has_been_recorded,
                                                getDailyActionButtons(),
                                            );
                                        } else {
                                            await this.bot.sendMessage(
                                                this.chatId,
                                                strings.ups,
                                            );
                                        }
                                    });
                                } else {
                                    if (this.text.length < 9) {
                                        await this.bot.sendMessage(
                                            this.chatId,
                                            strings.soLittle,
                                        );
                                        return;
                                    }
                                    if (this.text.length > 560) {
                                        await this.bot.sendMessage(
                                            this.chatId,
                                            strings.soLong,
                                        );
                                        return;
                                    }
                                    taskSQL.createYesterdayTask({text: this.text, userId: userExistData?.id}, async (error) => {
                                        if (!error) {
                                            await this.bot.sendMessage(
                                                this.chatId,
                                                strings.great_Now_write_what_you_will_do,
                                            );
                                        } else {
                                            await this.bot.sendMessage(
                                                this.chatId,
                                                strings.ups,
                                            );
                                        }
                                    });
                                }
                            }
                        });

                    } else {
                        UserSQL.add(this.chatId, this.username, async (error) => {
                            if (error) {
                                await this.bot.sendMessage(
                                    this.chatId,
                                    strings.ups,
                                );
                            } else {
                                addQuote();
                            }
                        });
                    }
                });
            };
            addQuote();
        } catch (e) {
            await this.bot.sendMessage(
                this.chatId,
                strings.ups,
            );
        }
    }

    async edit() {
        try {
            UserSQL.userExist(this.username, async (error, userExistData) => {
                if (!userExistData?.id) {
                    await this.bot.sendMessage(
                        this.chatId,
                        strings.you_are_not_in_the_system,
                    );
                    return;
                }

                // Check if group report time has passed
                if (isGroupReportTimePassed()) {
                    await this.bot.sendMessage(
                        this.chatId,
                        strings.cannot_edit_after_report,
                    );
                    return;
                }

                // Check if user has a daily task today
                TaskSQL.getTodayReport(userExistData.id, async (error, todayTask) => {
                    if (error) {
                        await this.bot.sendMessage(
                            this.chatId,
                            strings.ups,
                        );
                        return;
                    }

                    if (!todayTask?.id || (!todayTask?.yesterday && !todayTask?.today)) {
                        await this.bot.sendMessage(
                            this.chatId,
                            strings.no_daily_to_edit,
                        );
                        return;
                    }

                    const dailyText = `<b>Твой текущий дейлик на сегодня:</b>\n\n` +
                        `<b>Что делал:</b>\n${todayTask.yesterday || strings.empty}\n\n` +
                        `<b>Что буду делать:</b>\n${todayTask.today || strings.empty}\n\n` +
                        `${strings.edit_select_part}`;

                    await this.bot.sendMessage(
                        this.chatId,
                        dailyText,
                        {
                            parse_mode: 'HTML',
                            ...getEditChoiceButtons(),
                        }
                    );
                });
            });
        } catch (e) {
            await this.bot.sendMessage(
                this.chatId,
                strings.ups,
            );
        }
    }

    async handleEditMessage() {
        const session = editSessions.get(this.chatId);
        if (!session) return false;

        // Check if group report time has passed while editing
        if (isGroupReportTimePassed()) {
            editSessions.delete(this.chatId);
            await this.bot.sendMessage(
                this.chatId,
                strings.cannot_edit_after_report,
            );
            return true;
        }

        // Check text length
        if (this.text.length < 9) {
            await this.bot.sendMessage(
                this.chatId,
                strings.soLittle,
                getCancelButton(),
            );
            return true;
        }
        if (this.text.length > 560) {
            await this.bot.sendMessage(
                this.chatId,
                strings.soLong,
                getCancelButton(),
            );
            return true;
        }

        if (session.step === 'waiting_yesterday') {
            editSessions.delete(this.chatId);
            TaskSQL.updateYesterdayTask({ text: this.text, userId: session.userId, date: session.date }, async (error) => {
                if (error) {
                    await this.bot.sendMessage(this.chatId, strings.ups);
                    return;
                }
                TaskSQL.getTodayReport(session.userId, async (err, updatedTask) => {
                    const msg = `${strings.edit_yesterday_success}\n\n` +
                        `<b>Твой дейлик:</b>\n\n` +
                        `<b>Что делал:</b>\n${updatedTask?.yesterday || this.text}\n\n` +
                        `<b>Что буду делать:</b>\n${updatedTask?.today || strings.empty}`;
                    await this.bot.sendMessage(this.chatId, msg, {
                        parse_mode: 'HTML',
                        ...getDailyActionButtons(),
                    });
                });
            });
            return true;
        }

        if (session.step === 'waiting_today') {
            editSessions.delete(this.chatId);
            TaskSQL.updateTodayTask({ text: this.text, userId: session.userId, date: session.date }, async (error) => {
                if (error) {
                    await this.bot.sendMessage(this.chatId, strings.ups);
                    return;
                }
                TaskSQL.getTodayReport(session.userId, async (err, updatedTask) => {
                    const msg = `${strings.edit_today_success}\n\n` +
                        `<b>Твой дейлик:</b>\n\n` +
                        `<b>Что делал:</b>\n${updatedTask?.yesterday || strings.empty}\n\n` +
                        `<b>Что буду делать:</b>\n${updatedTask?.today || this.text}`;
                    await this.bot.sendMessage(this.chatId, msg, {
                        parse_mode: 'HTML',
                        ...getDailyActionButtons(),
                    });
                });
            });
            return true;
        }

        if (session.step === 'waiting_both_yesterday') {
            session.newYesterday = this.text;
            session.step = 'waiting_both_today';
            await this.bot.sendMessage(
                this.chatId,
                strings.edit_both_step2,
                {
                    parse_mode: 'HTML',
                    ...getCancelButton(),
                }
            );
            return true;
        }

        if (session.step === 'waiting_both_today') {
            editSessions.delete(this.chatId);
            TaskSQL.updateBothTask({
                yesterday: session.newYesterday,
                today: this.text,
                userId: session.userId,
                date: session.date,
            }, async (error) => {
                if (error) {
                    await this.bot.sendMessage(this.chatId, strings.ups);
                    return;
                }
                const msg = `${strings.edit_both_success}\n\n` +
                    `<b>Твой дейлик:</b>\n\n` +
                    `<b>Что делал:</b>\n${session.newYesterday}\n\n` +
                    `<b>Что буду делать:</b>\n${this.text}`;
                await this.bot.sendMessage(this.chatId, msg, {
                    parse_mode: 'HTML',
                    ...getDailyActionButtons(),
                });
            });
            return true;
        }

        return false;
    }

    static async handleCallback(bot, query) {
        const chatId = query.message?.chat?.id;
        const data = query.data;
        const username = query.from?.username;

        if (!chatId || !data) return;

        const dummyMsg = { chat: { id: chatId }, from: query.from, text: '' };
        const task = new TgBotTaskImpl(bot, dummyMsg);

        if (data === CALLBACK_ACTIONS.EDIT_DAILY) {
            await bot.answerCallbackQuery(query.id).catch(() => {});
            await task.edit();
            return;
        }

        if (data === CALLBACK_ACTIONS.DELETE_DAILY) {
            await bot.answerCallbackQuery(query.id).catch(() => {});
            await task.delete();
            return;
        }

        if (data === CALLBACK_ACTIONS.EDIT_CANCEL) {
            editSessions.delete(chatId);
            await bot.answerCallbackQuery(query.id, { text: strings.edit_cancelled }).catch(() => {});
            await bot.sendMessage(chatId, strings.edit_cancelled);
            return;
        }

        if (data === CALLBACK_ACTIONS.EDIT_YESTERDAY || data === CALLBACK_ACTIONS.EDIT_TODAY || data === CALLBACK_ACTIONS.EDIT_BOTH) {
            if (isGroupReportTimePassed()) {
                await bot.answerCallbackQuery(query.id, { text: strings.cannot_edit_after_report, show_alert: true }).catch(() => {});
                await bot.sendMessage(chatId, strings.cannot_edit_after_report);
                return;
            }

            UserSQL.userExist(username, async (error, userExistData) => {
                if (!userExistData?.id) {
                    await bot.answerCallbackQuery(query.id).catch(() => {});
                    await bot.sendMessage(chatId, strings.you_are_not_in_the_system);
                    return;
                }

                TaskSQL.getTodayReport(userExistData.id, async (err, todayTask) => {
                    if (!todayTask?.id) {
                        await bot.answerCallbackQuery(query.id).catch(() => {});
                        await bot.sendMessage(chatId, strings.no_daily_to_edit);
                        return;
                    }

                    await bot.answerCallbackQuery(query.id).catch(() => {});

                    if (data === CALLBACK_ACTIONS.EDIT_YESTERDAY) {
                        editSessions.set(chatId, {
                            step: 'waiting_yesterday',
                            userId: userExistData.id,
                            date: todayTask.date,
                        });
                        await bot.sendMessage(chatId, strings.edit_enter_yesterday, {
                            parse_mode: 'HTML',
                            ...getCancelButton(),
                        });
                    } else if (data === CALLBACK_ACTIONS.EDIT_TODAY) {
                        editSessions.set(chatId, {
                            step: 'waiting_today',
                            userId: userExistData.id,
                            date: todayTask.date,
                        });
                        await bot.sendMessage(chatId, strings.edit_enter_today, {
                            parse_mode: 'HTML',
                            ...getCancelButton(),
                        });
                    } else if (data === CALLBACK_ACTIONS.EDIT_BOTH) {
                        editSessions.set(chatId, {
                            step: 'waiting_both_yesterday',
                            userId: userExistData.id,
                            date: todayTask.date,
                        });
                        await bot.sendMessage(chatId, strings.edit_both_step1, {
                            parse_mode: 'HTML',
                            ...getCancelButton(),
                        });
                    }
                });
            });
        }
    }

    async delete() {
        try {
            UserSQL.userExist(this.username, async (error, userExistData) => {
                if (!userExistData?.id) {
                    await this.bot.sendMessage(
                        this.chatId,
                        strings.you_are_not_in_the_system,
                    );
                    return;
                }

                // Check if group report time has passed
                if (isGroupReportTimePassed()) {
                    await this.bot.sendMessage(
                        this.chatId,
                        strings.cannot_delete_after_report,
                    );
                    return;
                }

                // Check if user has a daily task today
                TaskSQL.getTodayReport(userExistData.id, async (error, todayTask) => {
                    if (error) {
                        await this.bot.sendMessage(
                            this.chatId,
                            strings.ups,
                        );
                        return;
                    }

                    if (!todayTask?.id) {
                        await this.bot.sendMessage(
                            this.chatId,
                            strings.no_daily_to_delete,
                        );
                        return;
                    }

                    // Delete the daily task
                    TaskSQL.deleteTodayTask(userExistData.id, async (error) => {
                        editSessions.delete(this.chatId);
                        if (error) {
                            await this.bot.sendMessage(
                                this.chatId,
                                strings.ups,
                            );
                        } else {
                            await this.bot.sendMessage(
                                this.chatId,
                                strings.daily_deleted_successfully,
                            );
                        }
                    });
                });
            });
        } catch (e) {
            await this.bot.sendMessage(
                this.chatId,
                strings.ups,
            );
        }
    }
}

export default TgBotTaskImpl;
