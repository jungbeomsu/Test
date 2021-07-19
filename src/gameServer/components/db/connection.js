import mysql from 'mysql2';

const pool = mysql.createPool({
  host: '15.164.202.251',
  user: 'goapp',
  password: 'Yx8kzu5CiWoU?1ABM',
  database: 'town_dev',
  connectionLimit: 4,
});

export default pool;
