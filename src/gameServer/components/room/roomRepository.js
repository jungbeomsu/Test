import connection from "../db/connection";
import {db} from "../../../server/constants";

export class FirebaseRoom {
  constructor() {
    this.db = db;
  }

  async getRoom(roomName) {
    const doc = await db.collection("rooms").doc(roomName).get();
    if (!doc.exists) {
      throw new Error('Room does not exist in db');
    }
    return doc.data();
  }

  async getUserWithRoom(roomName, uid) {
    const doc = await db.collection("rooms").doc(roomName).collection("users").doc(uid).get()
    if (!doc.exists) {
      throw new Error('Record does not exist in db')
    }
    return doc.data();
  }

  updateRoom(roomName, data) {
    return this.db.collection("rooms").doc(roomName).update(data)
  }
}

export class RoomRepository {
  constructor() {
    this.conn = connection;
  }

  temporaryCall() {
    return new Promise((resolve, reject) => {
      this.conn.query(
        'SELECT * FROM `member` WHERE `name` = ?',
        ['first person'],
        (err, results) => {
          if (err) reject(err);
          else resolve(results[0])
        }
      );
    });
  }

  async getRoom(rawRoomName) {
    return new Promise((resolve, reject) => {
      const roomUrl = rawRoomName.substring(0, rawRoomName.indexOf('\\'));
      const roomName = rawRoomName.substring(rawRoomName.indexOf('\\') + 1);
      this.conn.query(
        'SELECT *, ru.status as user_status FROM `room` r JOIN `room_user` ru ON r.id = ru.room_id WHERE r.name = ? and r.room_url = ?',
        [roomName, roomUrl],
        (err, results) => {
          if (err) reject(err);
          else if(results.length === 0) reject("NOT FOUND")
          else {
            const ret = {
              name: results[0].name,
              map: results[0].description,
              modPassword: results[0].purpose,
              bannedIPs: results.reduce((acc, cur) => {
                acc[cur.user_id] = cur.user_status;
                return acc;
              }, {})
            };
            /*
            * name <- name
            * bannedIPs <- 조금 더 고민 name이랑 publicIds
            * map: 301 <- description
            * modPassword <- purpose
            * */
            resolve(ret);
          }
        }
      )
    })
  }

  async updateRoom(roomName, data) {
    return new Promise((resolve, reject) => {
      reject('Not Implemented');
    })
  }
}
