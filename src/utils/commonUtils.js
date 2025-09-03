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
    
    // Debug logging
    console.log(`UTC time: ${currentDateUTC.toISOString()}`);
    console.log(`Local time (+6): ${localTime.toISOString()}`);
    console.log(`Hours: ${hours}`);
    console.log(`Should shift to next day: ${hours >= 16}`);
    
    // If after 16:00 local time, add 8 hours to UTC (which gives us +14 total from UTC)
    // If before 16:00 local time, just use +6 from UTC
    const timeOffset = hours >= 16 ? 14 : 6;
    const adjustedTime = addHours(new Date(currentDateUTC), timeOffset);
    
    console.log(`Time offset: ${timeOffset}`);
    console.log(`Adjusted time: ${adjustedTime.toISOString()}`);
    
    // Use format without leading zeros to match existing database records
    const day = adjustedTime.getDate();
    const month = adjustedTime.getMonth() + 1;
    const year = adjustedTime.getFullYear();
    const result = `${day}.${month}.${year}`;
    
    console.log(`Final date: ${result}`);
    return result;
};

export const getCyrillicUsername = (username) => {
    return AVAILABLE_USERS_NAMES[AVAILABLE_USERS.indexOf(username)]
}
