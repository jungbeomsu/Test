import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: '15.164.202.251',
  user: 'goapp',
  password: 'Yx8kzu5CiWoU?1ABM',
  database: 'town_dev'
});

//TODO: Transaction 처리로 안정성 올리고 pool을 이용한 connection 관리로 성능향상시키기.
//아마 실시간으로 통신하는 serverEngine에 연결되어 발동되기때문에 lightweight query가 많지 않을까...생각합니다.

export default connection;
