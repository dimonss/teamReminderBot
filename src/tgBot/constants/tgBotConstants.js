export const COMMAND = {
    START: '/start',
    INFO: '/info',
    CHAT_ID: '/chat_id',
    REMIND: '/remind',
};

export const tgBotDisplayCommands = [
    {command: COMMAND.START, description: 'Запустить бота'},
    {command: COMMAND.INFO, description: 'Информация дейлике'},
    {command: COMMAND.REMIND, description: 'Тегнуть всех кто не написал дейлик'},
];
