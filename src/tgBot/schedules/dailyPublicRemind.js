import TaskSQL from "../../db/taskSQL.js";
import {AVAILABLE_USERS, bot, GROUP_CHAT_ID} from "../../index.js";
import strings from "../../constants/strings.js";
import UserSQL from "../../db/userSQL.js";
import {TELL_ME_THE_STATUS_STIKER, ZERO_BUGS} from "../../constants.js";

const dailyPublicRemind = async (username) => {
    try {
        if (username === AVAILABLE_USERS[0]) {
            await bot.sendMessage(GROUP_CHAT_ID, strings.command_not_available)
            return
        }
        TaskSQL.allToday(async (error, tasks) => {
            if (error) {
                await bot.sendMessage(GROUP_CHAT_ID, strings.ups)
                return
            }
            let userList = AVAILABLE_USERS.slice(0);
            if (tasks.length) {
                tasks?.forEach((item, index) => {
                    UserSQL.getUser(item.userId, async (error, user) => {
                        if (error) {
                            await bot.sendMessage(GROUP_CHAT_ID, strings.ups);
                            return
                        }
                        if (item?.yesterday) {
                            userList = userList.filter(item => item !== user.name)
                        }
                        if (tasks.length === index + 1) {
                            if (userList.length) {
                                const responseMessage = userList.reduce((acc, item) => acc + '@' + item + ' ', '')
                                await bot.sendSticker(GROUP_CHAT_ID, TELL_ME_THE_STATUS_STIKER);
                                await bot.sendMessage(
                                    GROUP_CHAT_ID,
                                    responseMessage
                                )
                            } else {
                                await bot.sendSticker(GROUP_CHAT_ID, ZERO_BUGS);
                                await bot.sendMessage(
                                    GROUP_CHAT_ID,
                                    strings.congratulation
                                )
                            }
                        }

                    })
                })
            } else {
                const responseMessage = userList.reduce((acc, item) => acc + '@' + item + ' ', '')
                await bot.sendSticker(GROUP_CHAT_ID, TELL_ME_THE_STATUS_STIKER);
                await bot.sendMessage(
                    GROUP_CHAT_ID,
                    responseMessage
                )
            }
        });
    } catch (e) {
        await bot.sendMessage(GROUP_CHAT_ID, strings.ups)
    }
}
export default dailyPublicRemind