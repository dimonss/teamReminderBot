import TaskSQL from "../../db/taskSQL.js";
import { GROUP_CHAT_ID, bot, AVAILABLE_USERS } from "../../index.js";
import strings from "../../constants/strings.js";
import UserSQL from "../../db/userSQL.js";
import { getRandomErrorMessageForPublicEmptyDaily } from "../../utils/rangomStringsUtils.js";
import { getCyrillicUsername, getAdmins } from "../../utils/commonUtils.js";

const dailyGroupReport = async (data) => {
    try {
        const admins = getAdmins();
        if (data?.username && !admins.includes(data.username)) {
            await bot.sendMessage(GROUP_CHAT_ID, strings.command_not_available, data.message_thread_id)
            return
        }
        TaskSQL.allToday(async (error, tasks) => {
            if (error) {
                await bot.sendMessage(GROUP_CHAT_ID, strings.ups, data.message_thread_id)
                return
            }
            let responseMessage = '';
            if (tasks.length) {
                // Process all tasks and wait for all user data to be loaded
                const processTasks = async () => {
                    const promises = tasks.map((item) => {
                        return new Promise((resolve) => {
                            UserSQL.getUser(item.userId, (error, user) => {
                                if (error || !user) {
                                    resolve(null);
                                } else if (item?.yesterday) {
                                    resolve({
                                        name: getCyrillicUsername(user.name),
                                        yesterday: item.yesterday,
                                        today: item.today || strings.empty
                                    });
                                } else {
                                    resolve(null);
                                }
                            });
                        });
                    });

                    const results = await Promise.all(promises);
                    const validResults = results.filter(result => result !== null);

                    if (validResults.length > 0) {
                        responseMessage = validResults.map(result =>
                            `${result.name}:\n\n` +
                            `Что делал:\n${result.yesterday}\n\n` +
                            `Что буду делать:\n${result.today}` +
                            `\n_____________________________\n\n`
                        ).join('');
                    }

                    await bot.sendMessage(
                        GROUP_CHAT_ID,
                        responseMessage || getRandomErrorMessageForPublicEmptyDaily(),
                        data.message_thread_id
                    );
                };

                await processTasks();
            } else {
                await bot.sendMessage(
                    GROUP_CHAT_ID,
                    getRandomErrorMessageForPublicEmptyDaily(),
                    data.message_thread_id
                )
            }
        });
    } catch (e) {
        await bot.sendMessage(GROUP_CHAT_ID, strings.ups, data.message_thread_id)
    }
}
export default dailyGroupReport