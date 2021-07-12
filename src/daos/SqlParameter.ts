import { TediousType } from 'tedious';

export interface SqlParameter {
    name: string;
    type: TediousType;
    value: any;
}