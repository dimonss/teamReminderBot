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
    const adjustedTime = hours >= 16 ? addHours(new Date(localTime), 8) : localTime;
    
    const day = adjustedTime.getDate().toString().padStart(2, '0');
    const month = (adjustedTime.getMonth() + 1).toString().padStart(2, '0');
    const year = adjustedTime.getFullYear();
    return `${day}.${month}.${year}`;
};

export const getCyrillicUsername = (username) => {
    return AVAILABLE_USERS_NAMES[AVAILABLE_USERS.indexOf(username)]
}
