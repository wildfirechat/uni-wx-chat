import DICT_ZI from "./data/dict-zi";
import DICT_PHRASES from "./data/phrases-dict";
import { toFixed } from "./format";
import SurnamePinyinData from "./data/surname";
import CompoundSurnamePinyinData from "./data/compound_surname";
import { hasKey, convertUserOptions, combo, compact } from "./util";
import { ENUM_PINYIN_MODE, ENUM_PINYIN_STYLE } from "./constant";
export default class PinyinBase {
    STYLE_TONE = ENUM_PINYIN_STYLE.TONE;
    STYLE_TONE2 = ENUM_PINYIN_STYLE.TONE2;
    STYLE_TO3NE = ENUM_PINYIN_STYLE.TO3NE;
    STYLE_NORMAL = ENUM_PINYIN_STYLE.NORMAL;
    STYLE_INITIALS = ENUM_PINYIN_STYLE.INITIALS;
    STYLE_FIRST_LETTER = ENUM_PINYIN_STYLE.FIRST_LETTER;
    STYLE_PASSPORT = ENUM_PINYIN_STYLE.PASSPORT;
    MODE_NORMAL = ENUM_PINYIN_MODE.NORMAL;
    MODE_SURNAME = ENUM_PINYIN_MODE.SURNAME;
    pinyin(hans, options) {
        if (typeof hans !== "string") {
            return [];
        }
        const opt = convertUserOptions(options);
        let pys;
        if (opt.mode === ENUM_PINYIN_MODE.SURNAME) {
            pys = this.surname_pinyin(hans, opt);
        }
        else {
            if (opt.segment) {
                pys = this.segment_pinyin(hans, opt);
            }
            else {
                pys = this.normal_pinyin(hans, opt);
            }
        }
        if (options?.compact) {
            pys = compact(pys);
        }
        return pys;
    }
    normal_pinyin(hans, options) {
        const pys = [];
        let nohans = "";
        for (let i = 0, l = hans.length; i < l; i++) {
            const words = hans[i];
            const firstCharCode = words.charCodeAt(0);
            if (DICT_ZI[firstCharCode]) {
                if (nohans.length > 0) {
                    pys.push([nohans]);
                    nohans = "";
                }
                pys.push(this.single_pinyin(words, options));
            }
            else {
                nohans += words;
            }
        }
        if (nohans.length > 0) {
            pys.push([nohans]);
            nohans = "";
        }
        return pys;
    }
    single_pinyin(han, options) {
        if (typeof han !== "string") {
            return [];
        }
        if (han.length !== 1) {
            return this.single_pinyin(han.charAt(0), options);
        }
        const hanCode = han.charCodeAt(0);
        if (!DICT_ZI[hanCode]) {
            return [han];
        }
        const pys = DICT_ZI[hanCode].split(",");
        if (!options.heteronym) {
            return [toFixed(pys[0], options.style)];
        }
        const py_cached = {};
        const pinyins = [];
        for (let i = 0, l = pys.length; i < l; i++) {
            const py = toFixed(pys[i], options.style);
            if (hasKey(py_cached, py)) {
                continue;
            }
            py_cached[py] = py;
            pinyins.push(py);
        }
        return pinyins;
    }
    segment(hans, segmentType) {
        return segment(hans, segmentType);
    }
    phrases_pinyin(phrases, options) {
        const py = [];
        if (hasKey(DICT_PHRASES, phrases)) {
            DICT_PHRASES[phrases].forEach(function (item, idx) {
                py[idx] = [];
                if (options.heteronym) {
                    item.forEach(function (py_item, py_index) {
                        py[idx][py_index] = toFixed(py_item, options.style);
                    });
                }
                else {
                    py[idx][0] = toFixed(item[0], options.style);
                }
            });
        }
        else {
            for (let i = 0, l = phrases.length; i < l; i++) {
                py.push(this.single_pinyin(phrases[i], options));
            }
        }
        return py;
    }
    groupPhrases(phrases) {
        if (phrases.length === 1) {
            return phrases[0];
        }
        const grouped = combo(phrases);
        return grouped;
    }
    surname_pinyin(hans, options) {
        return this.compound_surname(hans, options);
    }
    compound_surname(hans, options) {
        const len = hans.length;
        let prefixIndex = 0;
        let result = [];
        for (let i = 0; i < len; i++) {
            const twowords = hans.substring(i, i + 2);
            if (hasKey(CompoundSurnamePinyinData, twowords)) {
                if (prefixIndex <= i - 1) {
                    result = result.concat(this.single_surname(hans.substring(prefixIndex, i), options));
                }
                const pys = CompoundSurnamePinyinData[twowords].map((item) => {
                    return item.map((ch) => toFixed(ch, options.style));
                });
                result = result.concat(pys);
                i = i + 2;
                prefixIndex = i;
            }
        }
        result = result.concat(this.single_surname(hans.substring(prefixIndex, len), options));
        return result;
    }
    single_surname(hans, options) {
        let result = [];
        for (let i = 0, l = hans.length; i < l; i++) {
            const word = hans.charAt(i);
            if (hasKey(SurnamePinyinData, word)) {
                const pys = SurnamePinyinData[word].map((item) => {
                    return item.map((ch) => toFixed(ch, options.style));
                });
                result = result.concat(pys);
            }
            else {
                result.push(this.single_pinyin(word, options));
            }
        }
        return result;
    }
    compare(hanA, hanB) {
        const pinyinA = this.pinyin(hanA);
        const pinyinB = this.pinyin(hanB);
        return String(pinyinA).localeCompare(String(pinyinB));
    }
    compact(pys) {
        return compact(pys);
    }
}
export function getPinyinInstance(py) {
    const pinyin = py.pinyin.bind(py);
    pinyin.compare = py.compare.bind(py);
    pinyin.compact = py.compact.bind(py);
    pinyin.STYLE_TONE = ENUM_PINYIN_STYLE.TONE;
    pinyin.STYLE_TONE2 = ENUM_PINYIN_STYLE.TONE2;
    pinyin.STYLE_TO3NE = ENUM_PINYIN_STYLE.TO3NE;
    pinyin.STYLE_NORMAL = ENUM_PINYIN_STYLE.NORMAL;
    pinyin.STYLE_INITIALS = ENUM_PINYIN_STYLE.INITIALS;
    pinyin.STYLE_FIRST_LETTER = ENUM_PINYIN_STYLE.FIRST_LETTER;
    pinyin.STYLE_PASSPORT = ENUM_PINYIN_STYLE.PASSPORT;
    pinyin.MODE_NORMAL = ENUM_PINYIN_MODE.NORMAL;
    pinyin.MODE_SURNAME = ENUM_PINYIN_MODE.SURNAME;
    return pinyin;
}
//# sourceMappingURL=PinyinBase.js.map