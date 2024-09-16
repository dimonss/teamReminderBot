export const COMMAND = {
    START: '/start',
    INFO: '/info',
    CHAT_ID: '/chat_id',
    REMIND: '/remind',
    REMIND_PRIVATE: '/remind_private',
    TEG_ALL: '/teg_all',
    BUG_ON_PROD: '/bug_on_prod',
    BUG_ON_PRE_PROD: '/bug_on_pre_prod',
    EXPORT_XLSX: '/export_xlsx',
};

export const tgBotDisplayCommands = [
    {command: COMMAND.START, description: 'Запустить бота'},
    {command: COMMAND.INFO, description: 'Информация дейлике'},
    {command: COMMAND.REMIND, description: 'Тегнуть всех кто не написал дейлик'},
    {command: COMMAND.REMIND_PRIVATE, description: 'Отписать в личку всем кто не написал дейлик'},
    {command: COMMAND.TEG_ALL, description: 'Тегнуть всех участников команды'},
    {command: COMMAND.BUG_ON_PROD, description: 'Баг на проде!!!'},
    {command: COMMAND.BUG_ON_PRE_PROD, description: 'Баг на препроде!!!'},
    {command: COMMAND.EXPORT_XLSX, description: 'Экспорт XLSX файла'},
];
