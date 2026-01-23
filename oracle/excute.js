const oracledb = require("oracledb");

async function connectToOracle() {
    try {
        const connection = await oracledb.getConnection({
            user: "your_db_user",
            password: "your_db_password",
            connectString: "your_db_connection_string",
        });
        console.log("Connected to Oracle Database");
        return connection;
    } catch (err) {
        console.error("Error connecting to Oracle Database", err);
        throw err;
    }
}

async function callProcedure() {
    let connection;
  
    try {
        connection = await connectToOracle();
  
        const result = await connection.execute(
            `BEGIN
                my_procedure(:input_param);
            END;`,
            {
                input_param: 'Hello from Node.js' // Tham số đầu vào của procedure
            }
        );
  
        console.log("Procedure called successfully");
    } catch (err) {
        console.error("Error executing procedure", err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing the connection', err);
            }
        }
    }
}

async function callFunction() {
    let connection;
  
    try {
        connection = await connectToOracle();
  
        const result = await connection.execute(
            `BEGIN
                :result := my_function(:input_param);
            END;`,
            {
                input_param: 'Node.js',  // Tham số đầu vào của function
                result: { dir: oracledb.BIND_OUT, type: oracledb.STRING } // Tham số đầu ra
            }
        );
  
        console.log("Function result: ", result.outBinds.result);
    } catch (err) {
        console.error("Error executing function", err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing the connection', err);
            }
        }
    }
}

async function callProcedureWithOutput() {
    let connection;
  
    try {
        connection = await connectToOracle();
  
        const result = await connection.execute(
            `BEGIN
            my_procedure_with_output(:input_param, :output_param);
            END;`,
            {
                input_param: 'Node.js',
                output_param: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            }
        );
  
        console.log("Procedure output: ", result.outBinds.output_param);
    } catch (err) {
        console.error("Error executing procedure", err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing the connection', err);
            }
        }
    }
}

async function callProcedureWithCursor() {
    let connection;
  
    try {
        connection = await connectToOracle();
  
        const result = await connection.execute(
            `
                BEGIN
                    my_procedure_with_cursor(:cursor);
                END;
            `,
            {
                cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            }
        );
  
        const resultSet = result.outBinds.cursor;
        let row;
  
        while ((row = await resultSet.getRow())) {
            console.log(row);
        }
  
        await resultSet.close();
    } catch (err) {
        console.error("Error executing procedure with cursor", err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing the connection', err);
            }
        }
    }
}
