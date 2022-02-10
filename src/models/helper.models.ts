import { Constants } from './constants.models';
import moment from 'moment';

export class Helper {
    static getSetting(key: string): string {
        let toReturn = null;
        let settings = JSON.parse(window.localStorage.getItem(Constants.SETTINGS));
        if (settings && settings[key])
            return settings[key];
        else
            return toReturn;
    }

    static extractUserIdFromError(err) {
        if (err && err.error && err.error.text) {
            let errText = String(err.error.text);
            let usersIndex = errText.indexOf("/users/");
            if (usersIndex != -1) {
                errText = errText.substring(usersIndex + "/users/".length, errText.length);
                let qIndex = errText.indexOf("\"");
                if (qIndex != -1) {
                    return Number(errText.substring(0, qIndex));
                } else {
                    return -1;
                }
            } else {
                return -1;
            }
        } else {
            return -1;
        }
    }
    static extractOrderIdFromError(err) {
        if (err && err.error && err.error.text) {
            let errText = String(err.error.text);
            let usersIndex = errText.indexOf("/orders/");
            if (usersIndex != -1) {
                errText = errText.substring(usersIndex + "/orders/".length, errText.length);
                let qIndex = errText.indexOf("\"");
                if (qIndex != -1) {
                    return Number(errText.substring(0, qIndex));
                } else {
                    return -1;
                }
            } else {
                return -1;
            }
        } else {
            return -1;
        }
    }

    static getLocale(): string {
        let sl = window.localStorage.getItem(Constants.KEY_LOCALE);
        return sl && sl.length ? sl : "en";
    }

    static formatTimestampDateTime(timestamp: string, locale: string): string {
        return moment(timestamp).locale(locale).format("DD MMM, HH:mm");
    }

    static formatTimestampDate(timestamp: string, locale: string): string {
        return moment(timestamp).locale(locale).format("DD MMM YYYY");
    }

    //

    static getChatChild(userId: string, myId: string) {
        //example: userId="9" and myId="5" -->> chat child = "5-9"
        let values = [userId, myId];
        values.sort((one, two) => (one > two ? -1 : 1));
        return values[0] + "-" + values[1];
    }

    static formatMillisDateTime(millis: number, locale: string): string {
        //return moment(millis).locale(locale).format("ddd, MMM D, h:mm");
        return moment(millis).locale(locale).format("DD MMM, HH:mm");
    }

    // static formatTimestampDateTime(timestamp: string, locale: string): string {
    //     return moment(timestamp).locale(locale).format("ddd, MMM D, h:mm");
    // }

    static formatMillisDate(millis: number, locale: string): string {
        return moment(millis).locale(locale).format("DD MMM YYYY");
    }

    // static formatTimestampDate(timestamp: string, locale: string): string {
    //     return moment(timestamp).locale(locale).format("DD MMM YYYY");
    // }

    static formatMillisTime(millis: number, locale: string): string {
        return moment(millis).locale(locale).format("h:mm");
    }

    static formatTimestampTime(timestamp: string, locale: string): string {
        return moment(timestamp).locale(locale).format("h:mm");
    }
}