import { Entry } from "@entities/Entry";

// https://stackoverflow.com/questions/38416020/deep-copy-in-es6-using-the-spread-syntax
export function deepClone(obj: any): any {
    if(typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if(obj instanceof Date) {
        return new Date(obj.getTime());
    }

    if(obj instanceof Map) {
        return new Map(Array.from(obj.entries()));
    }

    if(obj instanceof Array) {
        return obj.reduce((arr, item, i) => {
            arr[i] = deepClone(item);
            return arr;
        }, []);
    }

    if(obj instanceof Object) {
        return Object.keys(obj).reduce((newObj: any, key) => {
            newObj[key] = deepClone(obj[key]);
            return newObj;
        }, {})
    }
}

export function mapKeys<TKey, TVal>(map: Map<TKey, TVal>): TKey[] {
    return Array.from(map.keys()) || [];
}

export function mapValues<TKey, TVal>(map: Map<TKey, TVal>): TVal[] {
    return Array.from(map.values()) || [];
}

export function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export function getEntryScoreForDict(dictScore: number): number {
    if (dictScore === 0) return 0;
    return (dictScore / 25) + 1;
}

export function getEntryScoreForDictAlt(dictScore: number): number {
    if (dictScore <= 40) return 2;
    return 3;
}

export function getDictScoreForEntry(entry: Entry): number {
    if (!entry.qualityScore || !entry.obscurityScore) return 0;
    let quality = entry.qualityScore ? (entry.qualityScore - 1)*25 : 25;
    let obscurity = entry.obscurityScore ? (entry.obscurityScore - 1)*25 : 25;
    let finalScore = (2*quality + obscurity) / 3;
    return Math.round(finalScore);
}

export function generateId(): string {
    let charPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
    let id = "";
    for (let i=0; i<11; i++) {
        id += charPool[getRandomInt(64)];
    }
    return id;
}
