export const COMMAND = {
    START: '/start',
    INFO: '/info',
    CHAT_ID: '/chat_id',
    REMIND: '/remind',
    REMIND_PRIVATE: '/remind_private',
};

export const tgBotDisplayCommands = [
    {command: COMMAND.START, description: 'Запустить бота'},
    {command: COMMAND.INFO, description: 'Информация дейлике'},
    {command: COMMAND.REMIND, description: 'Тегнуть всех кто не написал дейлик'},
    {command: COMMAND.REMIND_PRIVATE, description: 'Отписать в личку всех кто не написал дейлик'},
];
