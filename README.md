# Team Reminder Telegram Bot 🤖

A Telegram Bot built with Node.js to help development and design teams manage their completely automated daily standup reports. It regularly reminds members to write about their task statuses, collects them, and features handy Excel export options.

## ✨ Features
- **Automated Daily Reminders**: Supports both private (direct messages) and public (group chat) reminders.
- **Standup Management**: Allows users to add, update, and delete their daily task reports.
- **Reporting Time Enforcement**: Restricts deleting or changing reports after a designated group reporting time (dynamically configurable based on your timezone).
- **Excel Export**: Capable of generating and downloading `.xlsx` reports of tasks directly via Telegram commands, filterable by all-time, last month, or last week.
- **Role-Based Permissions**: Restricts certain commands (like exports or tagging) strictly to authorized users and admins.
- **Multiple Environments**: Supports distinct build configurations (`DEV`, `PROD`, `STAGE`) and allows separate instances for Flutter/Designer teams out of the box.
- **SQLite Database**: Lightweight, file-based SQLite database for storing users and tasks.

## 🛠 Tech Stack
- **Node.js**: Backend JavaScript runtime.
- **node-telegram-bot-api**: Powerful wrapper for interacting with the official Telegram Bot API.
- **Express**: To optionally serve data or handle HTTP webhooks if needed.
- **SQLite3**: Relational database for persistent storage.
- **node-cron**: Task scheduler for configuring exact reminder and reporting times.
- **xlsx**: For generating Excel spreadsheets of team daily reports.

## 🚀 Installation & Setup

### 1. Prerequisites
- Node.js (v18 or newer recommended)
- `npm` or `yarn` package manager
- A Telegram Bot Token from [@BotFather](https://t.me/botfather)

### 2. Clone the repository
```bash
git clone https://github.com/dimonss/teamReminderBot.git
cd teamReminderBot
```

### 3. Install dependencies
```bash
npm install
```

### 4. Environment Variables
Create a `.env` file in the root directory and configure the environment variables:
```env
# Essential Bot Configuration
TG_TOKEN=6498dfusd89fsdf89sd7f96oCCpw7dWZp3dDklUNp0
BOT_NAME=@exampleBot
GROUP_CHAT_ID=-7777777777

# Security & Permissions
AUTH=dh78as6d78as6d786asd78a6s78dyh78sa=
AVAILABLE_USERS=DiChDev|dmman171|DiChLtd
AVAILABLE_USERS_NAMES=Лид|Дима|ЛимТестовый
EXPORT_XLSX_USERS=DiChDev|dmman171|

# Application Settings
BUILD_TYPE=PROD # Options: DEV, PROD, STAGE
PORT=4000
IS_FLUTTER=false

# Timezone Adjustment
# Set to your server's/team's target timezone to ensure reports and cron jobs trigger accurately.
BOT_TIMEZONE=Asia/Bishkek
```

### 5. Running the Bot

**Development Mode** (with Nodemon):
```bash
npm run start:dev
```

**Production Mode** (requires PM2 installed globally):
```bash
# General Production
npm run start:prod

# Designer Team Instance
npm run start:designer_prod

# Flutter Team Instance
npm run start:flutter_prod
```

## 📝 Usage & Commands
When added to your Telegram group or used in private messages, the bot responds to predefined commands. Example core commands:
- `/start` - Start interacting with the bot.
- `/info` - Get your current daily report status.
- `/export_xlsx` - Export all stored reports to an Excel file (Authorized users only).
- `/export_xlsx_week` - Export the last 7 days of reports.
- `/export_xlsx_month` - Export the last 30 days of reports.
- `/delete_daily` - Delete your current unsubmitted daily report (Allowed only before the reporting cutoff time).

---
*Note: This system relies on strict username matching configured in the `.env` file. Users must have a Telegram `@username` arrayed in `AVAILABLE_USERS` to fully utilize the system.*
---

# Team Reminder Telegram Bot 🤖 (Русская версия)

Telegram-бот на Node.js, созданный для того, чтобы помогать командам разработчиков и дизайнеров полностью автоматизировать сбор ежедневных стендап-отчетов (дейликов). Он регулярно напоминает участникам о необходимости написать статус по своим задачам, собирает их ответы и имеет встроенные удобные функции выгрузки в Excel.

## ✨ Функционал
- **Автоматические напоминания**: Поддерживает как личные (в личные сообщения), так и публичные (в групповой чат) напоминания.
- **Управление отчетами**: Позволяет пользователям добавлять, обновлять и удалять свои ежедневные отчеты.
- **Ограничения по времени**: Запрещает удаление или изменение отчетов после наступления времени сдачи отчета в группу (время настраивается динамически на основе вашего часового пояса).
- **Экспорт в Excel**: Умеет генерировать и отправлять `.xlsx` файлы с отчетами о задачах прямо через команды в Telegram. Поддерживается фильтрация: всё время, за последний месяц, за последнюю неделю.
- **Ролевая система**: Ограничивает доступ к определенным командам (таким как выгрузка или тегирование всех участников) только для авторизованных пользователей и администраторов.
- **Разные окружения (Окружения)**: Из коробки поддерживает конфигурации `DEV` (разработка), `PROD` (продакшен), `STAGE` (тест), а также запуск отдельных инстансов для Flutter-разработчиков и дизайнеров.
- **База данных SQLite**: Легковесная, файловая база данных SQLite для надежного хранения пользователей и задач.

## 🛠 Технологический стек
- **Node.js**: Серверный движок JavaScript.
- **node-telegram-bot-api**: Мощная библиотека для взаимодействия с официальным Telegram Bot API.
- **Express**: Для опциональной отдачи данных или настройки HTTP вебхуков.
- **SQLite3**: Реляционная база данных для постоянного хранения.
- **node-cron**: Планировщик задач для точной настройки времени отправки напоминаний и отчетов в группу.
- **xlsx**: Для создания Excel-таблиц с ежедневными отчетами команды.

## 🚀 Установка и запуск

### 1. Требования
- Node.js (рекомендуется v18 и выше)
- Пакетный менеджер `npm` или `yarn`
- Токен Telegram-бота, полученный у [@BotFather](https://t.me/botfather)

### 2. Клонирование репозитория
```bash
git clone https://github.com/dimonss/teamReminderBot.git
cd teamReminderBot
```

### 3. Установка зависимостей
```bash
npm install
```

### 4. Переменные окружения
Создайте файл `.env` в корневой директории и настройте переменные окружения:
```env
# Обязательные настройки бота
TG_TOKEN=6498dfusd89fsdf89sd7f96oCCpw7dWZp3dDklUNp0
BOT_NAME=@exampleBot
GROUP_CHAT_ID=-7777777777

# Безопасность и права доступа
AUTH=dh78as6d78as6d786asd78a6s78dyh78sa=
AVAILABLE_USERS=DiChDev|dmman171|DiChLtd
AVAILABLE_USERS_NAMES=Лид|Дима|ЛимТестовый
EXPORT_XLSX_USERS=DiChDev|dmman171|

# Настройки приложения
BUILD_TYPE=PROD # Доступные варианты: DEV, PROD, STAGE
PORT=4000
IS_FLUTTER=false

# Настройка часового пояса
# Установите целевой часовой пояс сервера/команды, чтобы отчеты и cron задачи срабатывали в нужное время.
BOT_TIMEZONE=Asia/Bishkek
```

### 5. Запуск бота

**Режим разработки (Development Mode)** (через Nodemon):
```bash
npm run start:dev
```

**Продакшен (Production Mode)** (требуется глобально установленный PM2):
```bash
# Основной продакшен
npm run start:prod

# Отдельный бот для команды дизайнеров
npm run start:designer_prod

# Отдельный бот для команды Flutter
npm run start:flutter_prod
```

## 📝 Использование и Команды
После добавления в вашу Telegram-группу или при работе в личных сообщениях бот отвечает на заранее заданные команды. Примеры основных команд:
- `/start` - Начать взаимодействие с ботом.
- `/info` - Получить информацию о статусе вашего текущего ежедневного отчета.
- `/export_xlsx` - Экспортировать все сохраненные отчеты в Excel-файл (Только для авторизованных пользователей).
- `/export_xlsx_week` - Экспортировать отчеты за последние 7 дней.
- `/export_xlsx_month` - Экспортировать отчеты за последние 30 дней.
- `/delete_daily` - Удалить ваш текущий, еще не отправленный в группу дейлик (команда доступна только до времени отправки группового отчета).

---
*Примечание: Система работает на основе строгого совпадения имен пользователей (`@username`), настроенного в файле `.env`. Участники должны иметь Telegram `@username`, добавленный в массив `AVAILABLE_USERS`, чтобы полноценно пользоваться ботом.*
