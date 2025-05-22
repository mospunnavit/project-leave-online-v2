import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',       // หรือ 'db' ถ้าอยู่ใน docker compose
  port: 3306,              // พอร์ตของ MySQL
  user: 'root',
  password: '123456',
  database: 'testdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
