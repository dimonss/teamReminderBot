import TaskSQL from "../../db/taskSQL.js";
import {AVAILABLE_USERS, bot, GROUP_CHAT_ID} from "../../index.js";
import strings from "../../constants/strings.js";
import UserSQL from "../../db/userSQL.js";
import userSQL from "../../db/userSQL.js";
import {getRandomRequestMessageForPrivateEmptyDaily} from "../../utils/rangomStringsUtils.js";

const dailyPrivateRemind = async () => {
    try {
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
                                userList.forEach(item => {
                                    userSQL.getChatIdByUsername(item, async (error, data) => {
                                        if (error) {
                                            return
                                        }
                                        if (data?.chatId) {
                                            await bot.sendMessage(data.chatId, getRandomRequestMessageForPrivateEmptyDaily())
                                        }
                                    })
                                })
                            }
                        }

                    })
                })
            } else {
                userList.forEach(item => {
                    userSQL.getChatIdByUsername(item, async (error, data) => {
                        if (error) {
                            return
                        }
                        await bot.sendMessage(data.chatId, getRandomRequestMessageForPrivateEmptyDaily())
                    })
                })
            }


        });
    } catch (e) {
        await bot.sendMessage(GROUP_CHAT_ID, strings.ups)
    }
}
export default dailyPrivateRemind