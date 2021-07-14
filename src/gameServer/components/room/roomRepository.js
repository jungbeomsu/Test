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
    if(!doc.exists){
      throw new Error('Record does not exist in db')
    }
    return doc.data();
  }

  updateRoom(roomName, data){
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

  async getRoom(roomUrl) {
    return new Promise((resolve, reject) => {
      this.conn.query(
        'SELECT * FROM `room WHERE room_url = ?',
        [roomUrl],
        (err, results) => {
          if (err) reject(err);
          else resolve(results[0]);
        }
      )
    })
  }
  async updateRoom(roomName, data){
    return new Promise((resolve, reject) => {
      reject('Not Implemented');
    })
  }
}
