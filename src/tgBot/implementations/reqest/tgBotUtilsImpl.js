import {CHAT_TYPE, TELL_ME_THE_STATUS_STICKER} from '../../../constants.js';
import UserSQL from '../../../db/userSQL.js';
import TaskSQL from "../../../db/taskSQL.js";
import strings from "../../../constants/strings.js";
import {
    genRandomErrorMessageForPrivateEmptyDaily,
    getRandomMessageForBugOnPreProd, getRandomMessageForBugOnProd,
    getRandomSavelysStiker
} from "../../../utils/rangomStringsUtils.js";
import {AVAILABLE_USERS} from "../../../index.js";

class TgBotUtilsImpl {
    constructor(bot, msg) {
        this.bot = bot;
        this.chatId = msg?.chat?.id;
        this.text = msg.text;
        this.msg = msg;
    }

    async permissionValidator() {
        if (AVAILABLE_USERS.indexOf(this.msg.from.username) === -1) {
            await this.bot.sendMessage(this.chatId, strings.you_do_not_have_access_to_this_bot);
            return true
        }
    }

    async start() {
        await this.bot.sendSticker(this.chatId, TELL_ME_THE_STATUS_STICKER);
        await this.bot.sendMessage(
            this.chatId,
            strings.introductory_instructions,
        );
    }

    async startForGroup() {
        await this.bot.sendSticker(this.chatId, TELL_ME_THE_STATUS_STICKER);
    }

    async info() {
        try {
            UserSQL.findByChatId(this.msg.from.username, async (error, data) => {
                if (error) {
                    await this.bot.sendMessage(this.chatId, strings.ups);
                    return;
                }
                if (data) {
                    TaskSQL.getTodayReport(data?.id, async (error, taskData) => {
                        if (error) {
                            await this.bot.sendMessage(
                                this.chatId,
                                strings.ups,
                            );
                            return;
                        }
                        if (taskData?.yesterday || taskData?.today) {
                            await this.bot.sendMessage(
                                this.chatId,
                                `<b>Что делал:</b>\n${taskData.yesterday}\n\n<b>Что буду делать:</b>\n${taskData.today || strings.empty + "\n" + strings.send_a_message_and_it_will_be_added_here}`,
                                {parse_mode: 'HTML'},
                            );
                        } else {
                            await this.bot.sendMessage(
                                this.chatId,
                                genRandomErrorMessageForPrivateEmptyDaily(),
                            );
                        }
                    })

                } else {
                    await this.bot.sendMessage(
                        this.chatId,
                        strings.you_are_not_in_the_system,
                    );
                }
            })
        } catch (e) {
            console.log("/info command error");
            console.log(e);
            await this.bot.sendMessage(this.chatId, strings.ups);
        }
    }

    async getChatId() {
        await this.bot.sendMessage(this.chatId, this.chatId);
    }

    async tegAll() {
        if (this.msg.chat.type === CHAT_TYPE.GROUP || this.msg.chat.type === CHAT_TYPE.SUPERGROUP) {
            const allUsersString = "@" + AVAILABLE_USERS.filter(item => item !== this.msg.from.username)
                .reduce((outputString, item) => `${outputString} @${item}`)
            await this.bot.sendMessage(this.chatId, allUsersString);
        } else {
            await this.bot.sendMessage(this.chatId, strings.can_only_be_used_in_groups)
        }
    }

    async bugOnPreProd() {
        this.bot.sendSticker(this.chatId, getRandomSavelysStiker())
        this.bot.sendMessage(this.chatId, getRandomMessageForBugOnPreProd())
        this.tegAll()
    }

    async bugOnProd() {
        this.bot.sendSticker(this.chatId, getRandomSavelysStiker())
        this.bot.sendMessage(this.chatId, getRandomMessageForBugOnProd())
        this.tegAll()
    }
}

export default TgBotUtilsImpl;
