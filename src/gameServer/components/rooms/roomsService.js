import {auth, db} from "../../../server/constants";
import {Room} from "./room";

export class RoomsService {
  constructor() {
    this.db = db;
    this.auth = auth;
  }

  async getRoom(room) {
    let roomFirebase = room.replace("/", "\\");
    let doc = await db.collection("rooms").doc(roomFirebase).get();
    if (!doc.exists) {
      throw new Error('Room does not exist in db');
    }
    return new Room(room, doc.data());
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

      if (!room.map){
        socket.emit("roomClosed");
        throw new Error('Rejecting not exist map');
      }

      return room;
  }
  async isAccessibleToken(decodedToken){
    let uid = decodedToken.uid;
    const doc = await db.collection("rooms").doc(roomFirebase).collection("users").doc(uid).get();
    return doc.exists && doc.data()["hasAccess"]
  }

  async joinPlayerToRoom(room, socket) {
  }
}
