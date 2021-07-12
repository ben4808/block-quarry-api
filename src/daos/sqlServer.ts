import { Connection, Request } from "tedious";
import { SqlParameter } from "./SqlParameter";

function getSqlConnection(): Promise<Connection> {
    var config = {
        server: 'DESKTOP-178OO59',
        options: {
            database: 'block_quarry',
            instanceName: 'MSSQLSERVER',
        },
        authentication: {
            type: 'default',
            options: {
                userName: 'block_quarry_user',
                password: 'block_quarry_pass'
            }
        }
    }

    return new Promise<Connection>((resolve, reject) => {
        var connection = new Connection(config);
    
        connection.on('connect', function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });

        connection.connect();
    });
}

export async function sqlQuery(isSP: boolean, sqlOrSP: string, parameters?: SqlParameter[]): Promise<any[]> {
    let connection = await getSqlConnection();

    return new Promise<any>((resolve, reject) => {
        let rows = [] as any[];

        let request = new Request(sqlOrSP, function (err, rowCount) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }

            connection.close();
        });

        if (parameters) {
            for (let p of parameters) {
                request.addParameter(p.name, p.type, p.value);
            }
        }

        request.on('row', function(columns) {
            let row = {} as any;
            columns.forEach(function(column) {
                row[column.metadata.colName] = column.value;
            });
            rows.push(row);
        });

        if (isSP)
            connection.callProcedure(request);
        else
            connection.execSql(request);
    });
  }
