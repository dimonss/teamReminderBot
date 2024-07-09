import TaskSQL from "../../db/taskSQL.js";
import {AVAILABLE_USERS, bot, GROUP_CHAT_ID} from "../../index.js";
import UserSQL from "../../db/userSQL.js";
import userSQL from "../../db/userSQL.js";
import {getRandomRequestMessageForPrivateEmptyDaily} from "../../utils/rangomStringsUtils.js";
import {TELL_ME_THE_STATUS_STICKER} from "../../constants.js";
import strings from "../../constants/strings.js";

const dailyPrivateRemind = async (data) => {
    try {
        if (data?.username && data?.username !== AVAILABLE_USERS[0]) {
            await bot.sendMessage(GROUP_CHAT_ID, strings.command_not_available)
            return
        }
        TaskSQL.allToday(async (error, tasks) => {
            if (error) {
                return
            }
            let userList = AVAILABLE_USERS.slice(0); //for copy object
            if (tasks.length) {
                tasks?.forEach((item, index) => {
                    UserSQL.getUser(item.userId, async (error, user) => {
                        if (error) {
                            return
                        }
                        if (item?.yesterday) {
                            userList = userList.filter(item => item !== user.name)
                        }
                        //last iteration
                        if (tasks.length === index + 1) {
                            if (userList.length) {
                                userList.forEach(item => {
                                    userSQL.getChatIdByUsername(item, async (error, data) => {
                                        if (error) {
                                            return
                                        }
                                        if (data?.chatId) {
                                            await bot.sendSticker(data.chatId, TELL_ME_THE_STATUS_STICKER);
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
                        //if user have chat_id in db
                        if (data?.chatId) {
                            await bot.sendSticker(data.chatId, TELL_ME_THE_STATUS_STICKER);
                            await bot.sendMessage(data.chatId, getRandomRequestMessageForPrivateEmptyDaily())
                        }
                    })
                })
            }


        });
    } catch (e) {
        console.log("Error");
        console.log(e);
    }
}
export default dailyPrivateRemind