export interface Entry {
    entry: string;
    displayText: string;
    qualityScore?: number;
    obscurityScore?: number;
    dataSourceScore?: number;
    breakfastTestFailure?: boolean;
}
