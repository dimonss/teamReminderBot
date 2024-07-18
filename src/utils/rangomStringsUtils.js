import strings from "../constants/strings.js";
import {SAVELY_STICKER_1, SAVELY_STICKER_2, SAVELY_STICKER_3, SAVELY_STICKER_4} from "../constants.js";

const _getRandomElementFromArray = (list) => {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex]
}

export const genRandomErrorMessageForCompletedDaily = () => {
    const _arr = [
        strings.it_seems_you_already_posted_here_today,
        strings.and_it_wont_be_possible_to_change_everything,
        strings.did_you_do_anything_else,
        strings.post_on_this_topic_tomorrow
    ];
    return _getRandomElementFromArray(_arr)
}

export const genRandomErrorMessageForPrivateEmptyDaily = () => {
    const _arr = [
        strings.haven_t_written_anything_yet_today,
        strings.empty,
        strings.do_you_think_messages_appear_here_on_their_own,
        strings.it_seems_you_haven_t_posted_a_message_today_yet
    ];
    return _getRandomElementFromArray(_arr)
}

export const getRandomErrorMessageForPublicEmptyDaily = () => {
    const _arr = [
        strings.it_seems_no_one_has_posted_any_tasks_today,
        strings.everybody_put_the_bolt,
        strings.is_empty_everyone_s_still_sleeping,
        strings.kozhegu1ov
    ];
    return _getRandomElementFromArray(_arr)
}
export const getRandomRequestMessageForPrivateEmptyDaily = () => {
    const _arr = [
        strings.please_write_down_the_daily,
        strings.daily,
        strings.wakeup,
        strings.work_is_not_wolf,
        strings.write_anything
    ];
    return _getRandomElementFromArray(_arr)
}

export const getRandomSavelysStiker = () => {
    const _arr = [
        SAVELY_STICKER_1,
        SAVELY_STICKER_2,
        SAVELY_STICKER_3,
        SAVELY_STICKER_4,
    ]
    return _getRandomElementFromArray(_arr)

}

export const getRandomMessageForBugOnPreProd = () => {
    const _arr = [
        strings.bugOnPreProd,
    ];
    return _getRandomElementFromArray(_arr)
}
export const getRandomMessageForBugOnProd = () => {
    const _arr = [
        strings.bugOnProd,
    ];
    return _getRandomElementFromArray(_arr)
}
