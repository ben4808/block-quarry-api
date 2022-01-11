import  { Pool } from 'pg';
import { PostgresParameter } from './PostgresParameter';
import settings from '../settings.json';

let pool = new Pool({
    user: 'postgres',
    host: settings.api_base_url,
    database: 'block_quarry',
    password: settings.db_password,
    port: 5432,
});

export async function sqlQuery(isSP: boolean, sqlOrSP: string, parameters?: PostgresParameter[]): Promise<any[]> {
    let sqlText = "";
    let paramsArray = [] as string[];
    if (parameters)
        paramsArray = parameters.map(p => p.value);

    if (isSP) {
        if (paramsArray[0].includes("'")) {
            let a = 5;
        }
        let paramsStr = paramsArray.map(x => "'" + x.replace(/'/g, "''") + "'").join(", ");
        paramsArray = [];
        sqlText = `select * from ${sqlOrSP}(${paramsStr})`;
    }

    try {
        const res = await pool.query(sqlText, paramsArray);
        return res.rows;
    } catch (err: any) {
        console.log("Postgres error: " + err.stack);
        return [];
    }
}
