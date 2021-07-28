import {auth, db} from "../../../server/constants";
import bcrypt from "bcrypt";
import {RoomRepository} from "./roomRepository";
import {logger} from "../utils/logger";

export default class RoomService {
  constructor() {
    this.roomRepository = new RoomRepository();
    this.db = db;
    this.auth = auth;
  }

  async getRoomWithUser(rawRoomId) {
    logger.debug(`Get room name is : ${rawRoomId}.`);
    return await this.roomRepository.getRoomWithUsers(rawRoomId);
  }

  async canJoinToRoom(rawRoomId, userId) {
    try {
      const room = await this.getRoomWithUser(rawRoomId);
      if (!room || room.isBannedID(userId.toString()) || room.isClosed() || !room.map) {
        if(!room){
          logger.debug('Room is not exist');
        } else if(room.isBannedID(userId.toString())){
          logger.debug('Room banned you');
        } else if(room.isClosed()){
          logger.debug('Room Closed');
        } else {
          logger.debug('Room map not exist');
        }
        logger.debug('Room Reject you');
        return false;
      }
      return room;
    } catch (e) {
      logger.warn(JSON.stringify(e));
      return false;
    }
  }

  async getRoomWithAdmin(rawRoomId, userId) {
    const room = await this.roomRepository.getRoom(rawRoomId);
    if (!room.isAdmin(userId)) {
      throw new Error('Unauthorized');
    }
    return room;
  }

  async BanPlayer(rawRoomId, userId, requesterId) {
    // ban 하는 로직 수행
    const room = await this.roomRepository.getRoom(rawRoomId);
    if (!room.isAdmin(requesterId)) {
      throw new Error('Unauthorized');
    }
    const didUpdate = await this.roomRepository.updateRoomUser(rawRoomId, userId, "BAN");
    if(!didUpdate){
      logger.debug("Not Found");
      return room.bannedIDs;
    }

    const room2 = await this.getRoomWithUser(rawRoomId);
    return room2.bannedIDs;
  }

  async UnBanPlayer(rawRoomId, userId, requesterId) {
    let roomFirebase = rawRoomId.replace("/", "\\");
    const room = await this.roomRepository.getRoom(roomFirebase);
    if (!room.isAdmin(requesterId)) {
      throw new Error('Unauthorized');
    }
    const didUpdate = await this.roomRepository.updateRoomUser(roomFirebase, userId, "ENTER")
    if (!didUpdate) {
      logger.debug("Not Found");
      return room.bannedIDs;
    }
    const room2 = await this.getRoomWithUser(rawRoomId);
    return room2.bannedIDs;
  }

  async setRoomClose(rawRoomId, requesterId, closed) {
    let roomFirebase = rawRoomId.replace("/", "\\");
    const status = !!closed ? "CLOSED" : "ALIVE";
    const room = await this.roomRepository.getRoom(roomFirebase);
    if (!room.isAdmin(requesterId)) {
      logger.debug(`adminId: ${requesterId}. room_admin_id: ${room.adminId}`);
      throw new Error('Unauthorized');
    }
    return this.roomRepository.updateRoomStatus(roomFirebase, status);
  }

  changePassword(rawRoomId, password, userId) {
    let roomFirebase = rawRoomId.replace("/", "\\");
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
