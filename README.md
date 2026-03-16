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