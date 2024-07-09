import TaskSQL from "../../db/taskSQL.js";
import {GROUP_CHAT_ID, bot, AVAILABLE_USERS} from "../../index.js";
import strings from "../../constants/strings.js";
import UserSQL from "../../db/userSQL.js";
import {getRandomErrorMessageForPublicEmptyDaily} from "../../utils/rangomStringsUtils.js";
import {getCyrillicUsername} from "../../utils/commonUtils.js";

const dailyGroupReport = async (data) => {
    try {
        if (data?.username && data?.username !== AVAILABLE_USERS[0]) {
            await bot.sendMessage(GROUP_CHAT_ID, strings.command_not_available)
            return
        }
        TaskSQL.allToday(async (error, tasks) => {
            if (error) {
                await bot.sendMessage(GROUP_CHAT_ID, strings.ups)
                return
            }
            let responseMessage = '';
            if (tasks.length) {
                tasks?.forEach((item, index) => {
                    UserSQL.getUser(item.userId, async (error, user) => {
                        if (error) {
                            return item
                        } else {
                            if (item?.yesterday) {
                                responseMessage +=
                                    `${getCyrillicUsername(user.name)}:\n\n` +
                                    `Что делал:\n${item?.yesterday}\n\n` +
                                    `Что буду делать:\n${item?.today || strings.empty}` +
                                    `\n_____________________________\n\n`
                            }
                            if (tasks.length === index + 1) {
                                await bot.sendMessage(
                                    GROUP_CHAT_ID,
                                    responseMessage || getRandomErrorMessageForPublicEmptyDaily()
                                )
                            }
                        }
                    })
                })
            } else {
                await bot.sendMessage(
                    GROUP_CHAT_ID,
                    getRandomErrorMessageForPublicEmptyDaily()
                )
            }
        });
    } catch (e) {
        await bot.sendMessage(GROUP_CHAT_ID, strings.ups)
    }
}
export default dailyGroupReport