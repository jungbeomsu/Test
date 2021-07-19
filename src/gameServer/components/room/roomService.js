import {auth, db} from "../../../server/constants";
import bcrypt from "bcrypt";
import {RoomRepository} from "./roomRepository";
import {logger} from "../utils/logger";

export default class RoomService {
  constructor() {
    this.roomRepository = new RoomRepository();
    // this.firebaseRoom = new FirebaseRoom();
    this.db = db;
    this.auth = auth;
  }

  async getRoomWithUser(roomName) {
    let roomFirebase = roomName.replace("/", "\\");
    logger.debug(`Get room name is : ${roomFirebase}.`);
    return await this.roomRepository.getRoomWithUsers(roomFirebase);
  }

  async canJoinToRoom2(roomName, userId) {
    try {
      const room = await this.getRoomWithUser(roomName);
      if (!room || room.isBannedID(userId.toString()) || room.isClosed() || !room.map) {
        return false;
      }
      return room;
    } catch (e) {
      return false;
    }
  }

  async canJoinToRoom(roomName, userId, socket) {
    // try {
    const room = await this.getRoomWithUser(roomName)

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

  async getRoomWithAdmin(roomName, userId) {
    let roomFirebase = roomName.replace("/", "\\");
    const room = await this.roomRepository.getRoom(roomName);
    if (!room.isAdmin(userId)) {
      throw new Error('Unauthorized');
    }
    return room;
  }

  async BanPlayer(roomName, userId, requesterId) {
    let roomFirebase = roomName.replace("/", "\\");
    // bann하는 로직 수행
    const room = await this.roomRepository.getRoom(roomFirebase);
    if (!room.isAdmin(requesterId)) {
      throw new Error('Unauthorized');
    }
    const didUpdate = await this.roomRepository.updateRoomUser(roomFirebase, userId, "BAN");
    if(!didUpdate){
      logger.debug("Not Found");
      return room.bannedIDs;
    }

    const room2 = await this.getRoomWithUser(roomName);
    return room2.bannedIDs;
  }

  async UnBanPlayer(roomName, userId, requesterId) {
    let roomFirebase = roomName.replace("/", "\\");
    const room = await this.roomRepository.getRoom(roomFirebase);
    if (!room.isAdmin(requesterId)) {
      throw new Error('Unauthorized');
    }
    const didUpdate = await this.roomRepository.updateRoomUser(roomFirebase, userId, "ENTER")
    if (!didUpdate) {
      logger.debug("Not Found");
      return room.bannedIDs;
    }
    const room2 = await this.getRoomWithUser(roomName);
    return room2.bannedIDs;
  }

  async setRoomClose(roomName, requesterId, closed) {
    let roomFirebase = roomName.replace("/", "\\");
    const status = !!closed ? "CLOSED" : "ALIVE";
    const room = await this.roomRepository.getRoom(roomFirebase);
    if (!room.isAdmin(requesterId)) {
      logger.debug(`adminId: ${requesterId}. room_admin_id: ${room.adminId}`);
      throw new Error('Unauthorized');
    }
    return this.roomRepository.updateRoomStatus(roomFirebase, status);
  }

  changePassword(roomId, password, userId) {
    let roomFirebase = roomId.replace("/", "\\");
    return this.roomRepository.getRoom(roomFirebase)
      .then(r => {
        if (!r.isAdmin(userId)) {
          throw new Error('Unauthorized');
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
