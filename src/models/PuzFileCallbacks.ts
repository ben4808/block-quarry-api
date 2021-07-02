export interface PuzFileCallbacks {
    titleFunc?: (puzTitle: string) => string;
    authorFunc?: (puzAuthor: string) => string[];
}