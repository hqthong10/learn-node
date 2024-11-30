/**
 * handle for date
 */

import { pad2 } from '~/services/helper';

export function formatTimeLive(date) {
    const day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear(),
        hours = date.getHours(),
        minutes = date.getMinutes();
    return pad2(hours) + ':' + pad2(minutes) + ' - ' + pad2(day) + '/' + pad2(month) + '/' + pad2(year);
}

export function formatPiepTime(date) {
    const t = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (t < 60) {
        return { val: '', mess: 'time_just_now' };
    } else if (t < 3600) {
        return { val: Math.floor((t % 3600) / 60).toString(), mess: 'time_minute_ago' };
    } else if (t < 24 * 3600) {
        return { val: Math.floor(t / 3600).toString(), mess: 'time_hour_ago' };
    } else if (t < 7 * 24 * 3600) {
        return { val: Math.floor(t / (24 * 3600)).toString(), mess: 'time_day_ago' };
    } else {
        const day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear();
        return { val: pad2(day) + '/' + pad2(month) + '/' + pad2(year), mess: '%s' };
    }
}

export function secondToHHMMSS(sec = 0) {
    if (sec <= 0) {
        return '00:00:00';
    }
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor((sec % 3600) % 60);
    return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

export function secondToMMSS(sec = 0) {
    if (sec <= 0) {
        return '00:00';
    }
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor((sec % 3600) % 60);
    return `${pad2(m)}:${pad2(s)}`;
}

export function formatDate(date) {
    const day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear();
    const monthStr = month < 10 ? '0' + month : month;
    return String(day) + String(monthStr) + String(year);
}

export function formatDateDDMMYYYY(date) {
    const day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear();
    const monthStr = month < 10 ? '0' + month : month;
    return String(day) + '/' + String(monthStr) + '/' + String(year);
}

// input: Date object -> dd/MM/yyyy hh:mm:ss
export function getDdMMyyyyHhmmss(date) {
    const dformat = [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/') + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
    return dformat;
}

// input: Date object -> dd/MM/yyyy hh:mm:ss
export function getDdMMyyyyHhmm(date) {
    const dformat = [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/') + ' ' + [date.getHours(), date.getMinutes()].join(':');
    return dformat;
}

// return GMT +0 time as timestamp
export function getCurrentUTC() {
    const date = new Date();
    return +new Date(+date + date.getTimezoneOffset() * 60 * 60 * 1000);
}

export function formatDateWithType(dateStr, format) {
    const date = new Date(dateStr);
    const year = pad2(date.getFullYear()),
        month = pad2(date.getMonth() + 1),
        day = pad2(date.getDate()),
        hours = pad2(date.getHours()),
        minutes = pad2(date.getMinutes()),
        seconds = pad2(date.getSeconds());
    return format.replace('yyyy', year).replace('MM', month).replace('dd', day).replace('hh', hours).replace('mm', minutes).replace('ss', seconds);
}

export function formatTimeChat(dateStr) {
    const d = new Date(dateStr);
    const second = Math.floor((new Date().getTime() - d.getTime()) / 1000);
    let val = `${formatDateWithType(dateStr, 'hh:mm')}`;
    let label = '';
    if (second < 60) {
        label = 'time_just_now';
        val = '';
    } else if (second < 3600) {
        label = 'time_minute_ago';
        val = Math.floor(second / 60).toString();
    }
    return { val, label };
}

export function getDateName(dateStr) {
    const d = new Date(dateStr);
    const td = new Date();
    const week = ['time_sunday', 'time_monday', 'time_tuesday', 'time_wednesday', 'time_thursday', 'time_friday', 'time_saturday'];
    const s = Math.floor((td.getTime() - d.getTime()) / 1000);
    let val = pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear();
    let label = '';
    if (s < 7 * 24 * 60 * 60) {
        val = '';
        if (d.getDate() === td.getDate()) {
            label = 'time_today';
        } else if (d.getDate() + 1 === td.getDate()) {
            label = 'time_yesterday';
        } else {
            label = week[d.getDay()];
        }
    }
    return { val, label };
}
