import { Connection, Request } from "tedious";

function getSqlConnection(): Promise<Connection> {
    var config = {
        server: 'DESKTOP-178OO59',
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
    });
}

export async function sqlQuery(query: string): Promise<any[]> {
  let connection = await getSqlConnection();

  return new Promise<any>((resolve, reject) => {
    let request = new Request(query, function (err, rowCount, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }

        connection.close();
    })

    connection.execSql(request);
  });
}