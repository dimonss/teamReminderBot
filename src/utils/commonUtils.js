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
    const currentDateUTCPlus6 = addHours(new Date(currentDateUTC), 6);
    return (currentDateUTCPlus6.getDate() + '.' + (currentDateUTCPlus6.getMonth() + 1) + '.' + currentDateUTCPlus6.getFullYear());
};

export const getCyrillicUsername = (username) => {
    return AVAILABLE_USERS_NAMES[AVAILABLE_USERS.indexOf(username)]
}
