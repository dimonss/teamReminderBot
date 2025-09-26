import {commonDto} from '../DTO/common.js';
import {STATUS} from '../constants.js';
import {AUTH, AVAILABLE_USERS, AVAILABLE_USERS_NAMES, IS_DESIGNERS} from '../index.js';

export const checkAuth = (req, res) => {
    if (req?.headers?.authorization?.split(' ')[1] !== AUTH) {
        res.status(401).json(commonDto(STATUS.ERROR, 'error auth'));
        return false;
    }
    return true;
};

const addHours = (date, hours) => {
    date.setHours(date.getHours() + hours);
    return date;
};

export const getCurrentDate = () => {
    const currentDateUTC = new Date();
    
    // Get UTC hours and add 6 to get local hours
    const utcHours = currentDateUTC.getUTCHours();
    const localHours = (utcHours + 6) % 24;
    
    // If after 16:00 local time, add 8 hours to UTC (which gives us +14 total from UTC)
    // If before 16:00 local time, just use +6 from UTC
    const timeOffset = localHours >= 16 ? 14 : 6;
    const adjustedTime = addHours(new Date(currentDateUTC), timeOffset);
    
    // Use format without leading zeros to match existing database records
    const day = adjustedTime.getDate();
    const month = adjustedTime.getMonth() + 1;
    const year = adjustedTime.getFullYear();
    return `${day}.${month}.${year}`;
};

export const getCyrillicUsername = (username) => {
    return AVAILABLE_USERS_NAMES[AVAILABLE_USERS.indexOf(username)]
}

export const isGroupReportTimePassed = () => {
    const currentDateUTC = new Date();
    const utcHours = currentDateUTC.getUTCHours();
    const localHours = (utcHours + 6) % 24;
    
    // Get current time in local timezone
    const timeOffset = localHours >= 16 ? 14 : 6;
    const adjustedTime = addHours(new Date(currentDateUTC), timeOffset);
    const currentHour = adjustedTime.getHours();
    const currentMinute = adjustedTime.getMinutes();
    
    // Check if we're past the group report time
    // For designers: 11:03, for regular: 9:15
    const reportHour = IS_DESIGNERS ? 11 : 9;
    const reportMinute = IS_DESIGNERS ? 3 : 15;
    
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    const reportTimeInMinutes = reportHour * 60 + reportMinute;
    
    return currentTimeInMinutes > reportTimeInMinutes;
}
