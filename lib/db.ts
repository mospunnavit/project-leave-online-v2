import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '192.168.107.146',       // หรือ 'db' ถ้าอยู่ใน docker compose
  port: 3306,              // พอร์ตของ MySQL
  user: 'root',
  password: '1234',
  database: 'Test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
