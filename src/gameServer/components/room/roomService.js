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
    let data = await this.roomRepository.getRoomWithUsers(roomFirebase);
    console.log(JSON.stringify(data));
    return new Room(roomName, data);
  }

  async canJoinToRoom(roomName, userId, socket) {
    // try {
    const room = await this.getRoom(roomName)

    if (room.isBannedID(userId.toString())) {
      // 원래는 이런 throw를 checkBannedIPs에 넣는게 맞는 듯.
      socket.emit("roomClosed");
      throw new Error(`Reject banned user: ${userId}`);
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

  async BanPlayer(roomName, userId, adminId) {
    let roomFirebase = roomName.replace("/", "\\");
    // bann하는 로직 수행
    const room = await this.roomRepository.getRoom(roomFirebase);
    if(room.adminId != adminId){
      console.log(`adminId: ${adminId}. room_admin_id: ${room.adminId}`);
      throw new Error('Unauthorized');
    }

    return this.roomRepository.updateRoomUser(roomFirebase, userId, "BAN")
      .then(() => {
        this.getRoom(roomName).then(r => {
          return r.bannedIDs;
        }).catch(e => {
          throw e;
        })
      })
      .catch(e => {
        throw e;
      });
  }

  async UnBanPlayer(roomName, userId, adminId) {// TODO: 질의문안에 admin 넣어서 보내면 두번날릴거 한번으로 줄일 수 있음.
    let roomFirebase = roomName.replace("/", "\\");
    const room = await this.roomRepository.getRoom(roomFirebase);
    if(room.adminId != adminId){
      throw new Error('Unauthorized');
    }
    await this.roomRepository.updateRoomUser(roomFirebase, userId, "ENTER")
    const room2 = await this.getRoom(roomName);
    return room2.bannedIDs;
  }

  setRoomClose(roomName, closed) {
    let roomFirebase = roomName.replace("/", "\\");
    const status = !!closed ? "CLOSED" : "OPEN";
    return this.roomRepository.updateRoomStatus(roomFirebase, status);
  }

  changeModPassword(roomName, newPassword) {
    let roomFirebase = roomName.replace("/", "\\");
    return this.roomRepository.updateRoom(roomFirebase, {"modPassword": bcrypt.hashSync(newPassword, 10)});
  }

  changePassword(roomName, password, userId) {
    // newPassword가 undefined 이거나 "" 라면 => null로 넣어주고
    // 그렇지 않다면 암호화해서 넣어준다.
    let roomFirebase = roomName.replace("/", "\\");
    return this.roomRepository.getRoom(roomFirebase)
      .then(r => {
        if (r.adminId != userId) {
          throw new Error('Not Authorized');
        } else {
          const newPassword = (password === "" || password === undefined) ? null : bcrypt.hashSync(password, 10);
          return this.roomRepository.updateRoomPassword(roomFirebase, newPassword, userId);
        }
      })
      .catch(e => {
        throw e;
      });
  }
}
