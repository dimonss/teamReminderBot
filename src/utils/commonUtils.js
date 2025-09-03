import {commonDto} from '../DTO/common.js';
import {STATUS} from '../constants.js';
import {AUTH, AVAILABLE_USERS, AVAILABLE_USERS_NAMES} from '../index.js';

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
    
    // Convert to +6 timezone (your local timezone)
    const localTime = addHours(new Date(currentDateUTC), 6);
    
    // If it's after 16:00 local time, shift to next day
    // This allows employees to submit daily reports after 16:00 and have them count for the next day
    const hours = localTime.getHours();
    
    // If after 16:00 local time, add 8 hours to UTC (which gives us +14 total from UTC)
    // If before 16:00 local time, just use +6 from UTC
    const timeOffset = hours >= 16 ? 14 : 6;
    const adjustedTime = addHours(new Date(currentDateUTC), timeOffset);
    
    const day = adjustedTime.getDate().toString().padStart(2, '0');
    const month = (adjustedTime.getMonth() + 1).toString().padStart(2, '0');
    const year = adjustedTime.getFullYear();
    return `${day}.${month}.${year}`;
};

export const getCyrillicUsername = (username) => {
    return AVAILABLE_USERS_NAMES[AVAILABLE_USERS.indexOf(username)]
}
