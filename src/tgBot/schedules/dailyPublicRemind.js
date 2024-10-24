import TaskSQL from "../../db/taskSQL.js";
import {AVAILABLE_USERS, bot, GROUP_CHAT_ID} from "../../index.js";
import strings from "../../constants/strings.js";
import UserSQL from "../../db/userSQL.js";
import {TELL_ME_THE_STATUS_STICKER, ZERO_BUGS_STICKER} from "../../constants.js";

const dailyPublicRemind = async (data) => {
    try {
        if (data?.username && data?.username !== AVAILABLE_USERS[0]) {
            await bot.sendMessage(GROUP_CHAT_ID, strings.command_not_available, data.message_thread_id)
            return
        }
        TaskSQL.allToday(async (error, tasks) => {
            if (error) {
                await bot.sendMessage(GROUP_CHAT_ID, strings.ups, data.message_thread_id)
                return
            }
            let userList = AVAILABLE_USERS.slice(0);
            if (tasks.length) {
                tasks?.forEach((item, index) => {
                    UserSQL.getUser(item.userId, async (error, user) => {
                        if (error) {
                            await bot.sendMessage(GROUP_CHAT_ID, strings.ups, data.message_thread_id);
                            return
                        }
                        if (item?.yesterday) {
                            userList = userList.filter(item => item !== user.name)
                        }
                        if (tasks.length === index + 1) {
                            if (userList.length) {
                                const responseMessage = userList.reduce((acc, item) => acc + '@' + item + ' ', '')
                                await bot.sendSticker(GROUP_CHAT_ID, TELL_ME_THE_STATUS_STICKER, data.message_thread_id);
                                await bot.sendMessage(
                                    GROUP_CHAT_ID,
                                    responseMessage,
                                    data.message_thread_id
                                )
                            } else {
                                await bot.sendSticker(GROUP_CHAT_ID, ZERO_BUGS_STICKER, data.message_thread_id);
                                await bot.sendMessage(
                                    GROUP_CHAT_ID,
                                    strings.congratulation,
                                    data.message_thread_id
                                )
                            }
                        }

                    })
                })
            } else {
                const responseMessage = userList.reduce((acc, item) => acc + '@' + item + ' ', '')
                await bot.sendSticker(GROUP_CHAT_ID, TELL_ME_THE_STATUS_STICKER, data.message_thread_id);
                await bot.sendMessage(
                    GROUP_CHAT_ID,
                    responseMessage,
                    data.message_thread_id
                )
            }
        });
    } catch (e) {
        await bot.sendMessage(GROUP_CHAT_ID, strings.ups, data.message_thread_id)
    }
}
export default dailyPublicRemind