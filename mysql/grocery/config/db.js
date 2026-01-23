import mysql from "mysql2/promise";

export const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "abc123",
  database: "grocery",
  waitForConnections: true,
  connectionLimit: 10,
});
