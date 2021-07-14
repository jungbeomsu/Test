import {auth, db} from "../../../server/constants";
import {Room} from "./room";
import bcrypt from "bcrypt";
import firebase from "firebase-admin";
import connection from "../db/connection";

export class RoomsService {
  constructor() {
    this.dbConn = connection;
    this.db = db;
    this.auth = auth;
  }

  async getRoom(roomName) {
    let roomFirebase = roomName.replace("/", "\\");
    console.log(`[GameServer] Get room name is : ${roomFirebase}.`);
    this.dbConn.query('SELECT * FROM `member`',  (err, results) => {
      if(err){
        console.error(err);
      }else{
        console.log('success');
        results.forEach((r) => {
          console.log(r);
        });
      }
    })
    console.log(`========= Get`)
    let doc = await db.collection("rooms").doc(roomFirebase).get();
    if (!doc.exists) {
      throw new Error('Room does not exist in db');
    }
    return new Room(roomName, doc.data());
  }

  async canJoinToRoom(roomName, socket) {
    // try {
    const room = await this.getRoom(roomName)

    if (room.isBannedIP(socket.handshake.address)) {
      // 원래는 이런 throw를 checkBannedIPs에 넣는게 맞는 듯.
      throw new Error(`Reject banned user: ${socket.handshake.address}`);
    }

    if (room.isClosed()) {
      socket.emit("roomClosed");
      throw new Error('Rejecting closed room');
    }

    if (!room.map) {
      socket.emit("roomClosed");
      throw new Error('Rejecting not exist map');
    }

    return room;
  }

  async isAccessibleToken(decodedToken, roomName) {
    let uid = decodedToken.uid;
    const doc = await db.collection("rooms").doc(roomName).collection("users").doc(uid).get();
    return doc.exists && doc.data()["hasAccess"]
  }

  async joinPlayerToRoom(room, socket) {
  }

  async getRoomWithModPassword(roomName, modPassword) {
    const room = await this.getRoom(roomName)
    if (!room.compareModPassword(modPassword)) {
      throw new Error('Wrong Password');
    }
    return room;
  }

  async BanPlayer(roomName, data) {
    let roomFirebase = roomName.replace("/", "\\");
    return this.db.collection("rooms").doc(roomFirebase).update("bannedIPs", data);
  }

  async UnBanPlayer(roomName, data) {
    let roomFirebase = roomName.replace("/", "\\");
    return this.db.collection("rooms").doc(roomFirebase).update("bannedIPs", data);
  }

  setRoomClose(roomName, closed) {
    let roomFirebase = roomName.replace("/", "\\");
    return this.db.collection("rooms").doc(roomFirebase).update({
      "closed": !!closed
    });
  }

  changeModPassword(roomName, newPassword) {
    let roomFirebase = roomName.replace("/", "\\");
    return db.collection("rooms").doc(roomFirebase).update({
      "modPassword": bcrypt.hashSync(newPassword, 10)
    })
  }

  changePassword(roomName, newPassword) {
    let roomFirebase = roomName.replace("/", "\\");
    if (newPassword) {
      return db.collection("rooms").doc(roomFirebase).update({
        "password": bcrypt.hashSync(newPassword, 10)
      })
    } else {
      // remove password
      return db.collection("rooms").doc(roomFirebase).update({
        "password": firebase.firestore.FieldValue.delete()
      })
    }
  }
}
