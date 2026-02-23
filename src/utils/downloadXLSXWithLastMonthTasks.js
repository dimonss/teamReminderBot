import UserSQL from "../db/userSQL.js";
import XLSX from "xlsx";
import fs from "fs";
import TaskSQL from "../db/taskSQL.js";
import { getCurrentDate, getLastMonthDateRange, parseDate } from "./commonUtils.js";

export const downloadXLSXWithLastMonthTasks =
    (api, bot) => {
        TaskSQL.all(
            (error, tasks) => {
                if (error) return api.next(error);

                const { start, end } = getLastMonthDateRange();
                const filteredTasks = tasks.filter(task => {
                    const taskDate = parseDate(task.date);
                    return taskDate >= start && taskDate <= end;
                });

                UserSQL.all(
                    (error, users) => {
                        if (error) return api.next(error);
                        const data = filteredTasks.map(item => ({
                            ...item,
                            userCyrillicName: users.find(user => user.id === Number(item.userId))?.cyrillicName
                        }))
                        const workbook = XLSX.utils.book_new();
                        const worksheet = XLSX.utils.json_to_sheet(data);
                        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users and Tasks');
                        const filePath = `team_tasks_last_month_${getCurrentDate()}.xlsx`;
                        XLSX.writeFile(workbook, filePath);
                        if (api) {
                            // send file HTTP
                            api.res.download(filePath, filePath, err => {
                                if (err) {
                                    console.error('Error sending file to HTTP:', err);
                                    api.res.status(500).send('Error exporting file');
                                }
                                // Delete the file after sending
                                fs.unlinkSync(filePath);
                            });
                        } else if (bot) {
                            // send file TG
                            bot.bot.sendDocument(bot.chatId, fs.createReadStream(filePath), bot.message_thread_id)
                                .then(() => {
                                    // Delete the file after sending
                                    fs.unlinkSync(filePath);
                                })
                                .catch(err => {
                                    console.error('Error export XLSX file to tg:', err);
                                });
                        }
                    },
                )
            },
        );

    };
