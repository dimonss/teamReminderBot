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
                // Process all tasks and wait for all user data to be loaded
                const processTasks = async () => {
                    const promises = tasks.map((item) => {
                        return new Promise((resolve) => {
                            UserSQL.getUser(item.userId, (error, user) => {
                                if (error || !user) {
                                    resolve(null);
                                } else if (item?.yesterday) {
                                    resolve(user.name);
                                } else {
                                    resolve(null);
                                }
                            });
                        });
                    });
                    
                    const results = await Promise.all(promises);
                    const usersWithReports = results.filter(result => result !== null);
                    
                    // Remove users who have submitted reports
                    userList = userList.filter(user => !usersWithReports.includes(user));
                    
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
                };
                
                await processTasks();
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