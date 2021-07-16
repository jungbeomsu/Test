import connection from "../db/connection";
import {db} from "../../../server/constants";
import {Room} from "./room";

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
  async getRoom(rawRoomName){
    return new Promise((resolve, reject) => {
      const roomUrl = rawRoomName.substring(0, rawRoomName.indexOf('\\'));
      const roomName = rawRoomName.substring(rawRoomName.indexOf('\\') + 1);
      this.conn.query(
        'SELECT * FROM `room` WHERE name = ? and room_url = ?',
        [roomName, roomUrl],
        (err, results) => {
          if (err) reject(err);
          else if(results.length === 0) reject("NOT FOUND")
          else {
            const ret = {
              id: results[0].id,
              name: results[0].name,
              map: results[0].preset_id,
              adminId: results[0].admin_id,
              creatorId:results[0].creator_id,
              password: results[0].password,
              status: results[0].status,
              purposeId: results[0].purpose_id,
              roomUrl: results[0].room_url,
              description: results[0].description,
            };
            resolve(new Room(rawRoomName, ret));
          }
        }
      )
    })
  }

  async getRoomWithUsers(rawRoomName) {
    return new Promise((resolve, reject) => {
      const roomUrl = rawRoomName.substring(0, rawRoomName.indexOf('\\'));
      const roomName = rawRoomName.substring(rawRoomName.indexOf('\\') + 1);
      this.conn.query(
        'SELECT *, ru.status as user_status FROM `room` r JOIN `room_user` ru ON r.id = ru.room_id WHERE r.name = ? and r.room_url = ?',
        [roomName, roomUrl],
        (err, results) => {
          results[0].purpose_id = undefined;
          if (err) reject(err);
          else if(results.length === 0) reject("NOT FOUND")
          else {
            const ret = {
              id: results[0].id,
              name: results[0].name,
              map: results[0].preset_id,
              adminId: results[0].admin_id,
              creatorId:results[0].creator_id,
              password: results[0].password,
              status: results[0].status,
              purposeId: results[0].purpose_id,
              roomUrl: results[0].room_url,
              description: results[0].description,
              bannedIPs: results.reduce((acc, cur) => {
                acc[cur.user_id] = cur.user_status;
                return acc;
              }, {})
            };
            resolve(new Room(rawRoomName, ret));
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

  async updateRoomUser(roomFirebase, userId, status) {
    return new Promise((resolve, reject) => {
      const [roomUrl, roomName] = this._extractRoomUrlAndName(roomFirebase);
      // roomUrl과 roomName의 조합은 unique한 room_id를 식별해내는데 충분. 왜냐하면 roomUrl이 그걸 위해 존재하기 때문
      this.conn.query(
        'UPDATE `room_user` SET status=? WHERE user_id=? and room_id=(SELECT r.id FROM room r WHERE r.name = ? and r.room_url = ?)',
        [status, userId, roomName, roomUrl],
        (err, results) => {
          if(err) reject(err);
          else{
            resolve(results.affectedRows > 0);
          }
        }
      )
    })
  }

  updateRoomStatus(roomFirebase, status) {
    return new Promise((resolve, reject) => {
      const [roomUrl, roomName] = this._extractRoomUrlAndName(roomFirebase);
      // roomUrl과 roomName의 조합은 unique한 room_id를 식별해내는데 충분. 왜냐하면 roomUrl이 그걸 위해 존재하기 때문
      this.conn.query(
        'UPDATE room SET status = ? WHERE name = ? and room_url = ?',
        [status, roomName, roomUrl],
        (err, results) => {
          if(err) reject(err);
          else{
            resolve(results.affectedRows > 0);
          }
        }
      )
    })
  }

  _extractRoomUrlAndName(roomFirebase){
    const roomUrl = roomFirebase.substring(0, roomFirebase.indexOf('\\'));
    const roomName = roomFirebase.substring(roomFirebase.indexOf('\\') + 1);
    return [roomUrl, roomName];
  }

  updateRoomPassword(roomFirebase, password) {
    return new Promise((resolve, reject) => {
      const [roomUrl, roomName] = this._extractRoomUrlAndName(roomFirebase);
      this.conn.query(
        'UPDATE room SET password = ? WHERE name = ? and room_url = ?',
        [password, roomName, roomUrl],
        (err, results) => {
          if(err) reject(err);
          else{
            resolve(results.affectedRows > 0);
          }
        }
      )
    })
  }
}
