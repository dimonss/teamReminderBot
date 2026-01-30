import TaskSQL from '../../db/taskSQL.js';
import { AVAILABLE_USERS, bot, GROUP_CHAT_ID } from '../../index.js';
import UserSQL from '../../db/userSQL.js';
import userSQL from '../../db/userSQL.js';
import { getRandomRequestMessageForPrivateEmptyDaily } from '../../utils/rangomStringsUtils.js';
import { TELL_ME_THE_STATUS_STICKER } from '../../constants.js';
import strings from '../../constants/strings.js';

const dailyPrivateRemind = async (data) => {
    try {
        if (data?.username && data?.username !== AVAILABLE_USERS[0]) {
            await bot.sendMessage(GROUP_CHAT_ID, strings.command_not_available);
            return;
        }
        TaskSQL.allToday(async (error, tasks) => {
            if (error) {
                return;
            }
            let userList = AVAILABLE_USERS.slice(1); // Исключаем первого юзера
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
                    const usersWithReports = results.filter((result) => result !== null);

                    // Remove users who have submitted reports
                    userList = userList.filter((user) => !usersWithReports.includes(user));

                    if (userList.length) {
                        // Send private messages to users who haven't submitted reports
                        const sendPrivateMessages = userList.map((item) => {
                            return new Promise((resolve) => {
                                userSQL.getChatIdByUsername(item, async (error, data) => {
                                    if (error || !data?.chatId) {
                                        resolve();
                                        return;
                                    }
                                    try {
                                        await bot.sendSticker(data.chatId, TELL_ME_THE_STATUS_STICKER);
                                        await bot.sendMessage(
                                            data.chatId,
                                            getRandomRequestMessageForPrivateEmptyDaily(),
                                        );
                                    } catch (e) {
                                        console.log('Error sending private message:', e);
                                    }
                                    resolve();
                                });
                            });
                        });

                        await Promise.all(sendPrivateMessages);
                    }
                };

                await processTasks();
            } else {
                // No tasks at all, send reminders to all users
                const sendPrivateMessages = AVAILABLE_USERS.slice(1).map((item) => {
                    return new Promise((resolve) => {
                        userSQL.getChatIdByUsername(item, async (error, data) => {
                            if (error || !data?.chatId) {
                                resolve();
                                return;
                            }
                            try {
                                await bot.sendSticker(data.chatId, TELL_ME_THE_STATUS_STICKER);
                                await bot.sendMessage(data.chatId, getRandomRequestMessageForPrivateEmptyDaily());
                            } catch (e) {
                                console.log('Error sending private message:', e);
                            }
                            resolve();
                        });
                    });
                });

                await Promise.all(sendPrivateMessages);
            }
        });
    } catch (e) {
        console.log('Error');
        console.log(e);
    }
};
export default dailyPrivateRemind;
