import {auth, db} from "../../../server/constants";
import {Room} from "./room";
import bcrypt from "bcrypt";
import firebase from "firebase-admin";
import {FirebaseRoom, RoomRepository} from "./roomRepository";

export default class RoomService {
  constructor() {
    this.roomRepository = new RoomRepository();
    // this.firebaseRoom = new FirebaseRoom();
    this.db = db;
    this.auth = auth;
  }

  async getRoom(roomName) {
    let roomFirebase = roomName.replace("/", "\\");
    console.log(`[GameServer] Get room name is : ${roomFirebase}.`);
    let data = await this.roomRepository.getRoom(roomFirebase);
    console.log(JSON.stringify(data));
    return new Room(roomName, data);
  }

  async canJoinToRoom(roomName,userId, socket) {
    // try {
    const room = await this.getRoom(roomName)

    if (room.isBannedID(userId.toString())) {
      // if (room.isBannedIP(socket.handshake.address)) {
      // 원래는 이런 throw를 checkBannedIPs에 넣는게 맞는 듯.
      socket.emit("roomClosed");
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
    const data = await this.roomRepository.getUserWithRoom(roomName, uid);
    return data["hasAccess"]
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
    return this.roomRepository.updateRoom(roomFirebase, {bannedIPs: data});
  }

  async UnBanPlayer(roomName, data) {
    let roomFirebase = roomName.replace("/", "\\");
    return this.roomRepository.updateRoom(roomFirebase, {bannedIPs: data});
  }

  setRoomClose(roomName, closed) {
    let roomFirebase = roomName.replace("/", "\\");
    return this.roomRepository.updateRoom(roomFirebase, {"closed": !!closed});
  }

  changeModPassword(roomName, newPassword) {
    let roomFirebase = roomName.replace("/", "\\");
    return this.roomRepository.updateRoom(roomFirebase, {"modPassword": bcrypt.hashSync(newPassword, 10)});
  }

  changePassword(roomName, newPassword) {
    let roomFirebase = roomName.replace("/", "\\");
    if (newPassword) {
      return this.roomRepository.updateRoom(roomFirebase, {
        "password": bcrypt.hashSync(newPassword, 10)
      });
    } else {
      // remove password
      return this.roomRepository.updateRoom(roomFirebase, {
        "password": firebase.firestore.FieldValue.delete()
      });
    }
  }
}
