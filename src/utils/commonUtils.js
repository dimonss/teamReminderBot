import { commonDto } from '../DTO/common.js';
import { STATUS } from '../constants.js';
import { AUTH, AVAILABLE_USERS, AVAILABLE_USERS_NAMES, IS_FLUTTER, BOT_TIMEZONE } from '../index.js';

export const getAdmins = () => IS_FLUTTER ? AVAILABLE_USERS.slice(0, 1) : AVAILABLE_USERS.slice(0, 2);

export const checkAuth = (req, res) => {
    if (req?.headers?.authorization?.split(' ')[1] !== AUTH) {
        res.status(401).json(commonDto(STATUS.ERROR, 'error auth'));
        return false;
    }
    return true;
};

const getLocalDateParts = (date = new Date()) => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: BOT_TIMEZONE,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    });

    const parts = formatter.formatToParts(date);
    const timeObj = {};
    for (const part of parts) {
        if (part.type !== 'literal') {
            timeObj[part.type] = parseInt(part.value, 10);
        }
    }
    return timeObj;
};

export const getCurrentDate = () => {
    let targetDate = new Date();
    let parts = getLocalDateParts(targetDate);

    // If after 16:00 local time, it is considered the next day
    if (parts.hour >= 16) {
        targetDate.setUTCDate(targetDate.getUTCDate() + 1);
        parts = getLocalDateParts(targetDate);
    }

    // Use format without leading zeros to match existing database records
    return `${parts.day}.${parts.month}.${parts.year}`;
};

export const getCyrillicUsername = (username) => {
    return AVAILABLE_USERS_NAMES[AVAILABLE_USERS.indexOf(username)]
}

export const getLastMonthDateRange = () => {
    const { year, month, day } = getLocalDateParts();
    // month is 1-12 in Intl format, but Date constructor expects 0-base for month
    const end = new Date(year, month - 1, day);
    const start = new Date(end);
    start.setMonth(start.getMonth() - 1);
    return { start, end };
}

export const getLastWeekDateRange = () => {
    const { year, month, day } = getLocalDateParts();
    const end = new Date(year, month - 1, day);
    const start = new Date(end);
    start.setDate(start.getDate() - 7);
    return { start, end };
}

export const parseDate = (dateStr) => {
    const parts = dateStr.split('.');
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
}

export const isGroupReportTimePassed = () => {
    const { hour, minute } = getLocalDateParts();

    // If it's 16:00 or later, it's considered the reporting period for the next day.
    // Therefore, the 09:15 deadline has not passed yet.
    if (hour >= 16) {
        return false;
    }

    // Check if we're past the group report time
    const reportHour = IS_FLUTTER ? 9 : 9;
    const reportMinute = IS_FLUTTER ? 15 : 15;

    const currentTimeInMinutes = hour * 60 + minute;
    const reportTimeInMinutes = reportHour * 60 + reportMinute;

    return currentTimeInMinutes > reportTimeInMinutes;
}
