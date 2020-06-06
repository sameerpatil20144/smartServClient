/* eslint-disable no-undef */
/* eslint-disable */
/* eslint-disable no-console */
import { getCookie } from '../cookies'
import moment from 'moment'

export const getDiff = (time, currentTime) => {
    var t1 = moment(time, "hh:mm:ss");
    var t2 = moment(currentTime, "hh:mm:ss");
    var difference = t1.diff(t2, 'seconds')
    return difference
}
