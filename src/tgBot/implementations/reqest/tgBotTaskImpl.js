import TaskSQL from '../../../db/taskSQL.js';
import UserSQL from "../../../db/userSQL.js";
import taskSQL from "../../../db/taskSQL.js";
import strings from "../../../constants/strings.js";
import {genRandomErrorMessageForCompletedDaily} from "../../../utils/rangomStringsUtils.js";
import {isGroupReportTimePassed} from "../../../utils/commonUtils.js";

class TgBotTaskImpl {
    constructor(bot, msg) {
        this.bot = bot;
        this.chatId = msg?.chat?.id;
        this.text = msg.text;
        this.username = msg.from.username;
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
                                if(!!yesterdayTextExistData?.today){
                                    await this.bot.sendMessage(
                                        this.chatId,
                                        genRandomErrorMessageForCompletedDaily(),
                                    );
                                    return
                                }
                                if (yesterdayTextExistData?.id) {
                                    if (this.text.length < 9) {
                                        await this.bot.sendMessage(
                                            this.chatId,
                                            strings.soLittle,
                                        );
                                        return
                                    }
                                    if (this.text.length > 300) {
                                        await this.bot.sendMessage(
                                            this.chatId,
                                            strings.soLong,
                                        );
                                        return
                                    }
                                    taskSQL.createTodayTask({text: this.text, userId: yesterdayTextExistData?.userId, date: yesterdayTextExistData.date}, async (error) => {
                                        if (!error) {
                                            await this.bot.sendMessage(
                                                this.chatId,
                                                strings.super_your_daily_has_been_recorded,
                                            );
                                        } else {
                                            await this.bot.sendMessage(
                                                this.chatId,
                                                strings.ups,
                                            );
                                        }
                                    })
                                } else {
                                    if (this.text.length < 9) {
                                        await this.bot.sendMessage(
                                            this.chatId,
                                            strings.soLittle,
                                        );
                                        return
                                    }
                                    if (this.text.length > 300) {
                                        await this.bot.sendMessage(
                                            this.chatId,
                                            strings.soLong,
                                        );
                                        return
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
                                    })
                                }
                            }
                        })

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
                        })
                    }
                })
            }
            addQuote();
        } catch (e) {
            await this.bot.sendMessage(
                this.chatId,
                strings.ups,
            );
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
