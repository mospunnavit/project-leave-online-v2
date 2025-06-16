// lib/db.ts
import mysql from 'mysql2/promise';

let pool: mysql.Pool;

if (!global.dbPool) {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: 0,
  });

  global.dbPool = pool;
} else {
  pool = global.dbPool;
}

export default pool;

// TypeScript: ป้องกัน error จาก global type
declare global {
  var dbPool: mysql.Pool | undefined;
}