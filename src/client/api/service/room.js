import {process} from "./process";
import moment from "moment";

export const room = {

  getRoom: async (roomId, passwd) => {

    let path = '/v1/room/get';
    let req = {
      "id": roomId,
      "password": passwd
    }
    let data = await process(path, req);
    if (!data.result.is_success) {
      return null;
    }
    return {
      adminId: data.admin_id,
      creatorId: data.creator_id,
      description: data.description,
      hasPassword: data.has_password,
      name: data.name,
      presetId: data.preset_id,
      roomId: data.room_id,
      status: data.status,
      createdAt: moment(data.created_at),
      updatedAt: moment(data.updated_at)
    };
  },

  getUserList: async (roomId) => {

    let path = '/v1/room/user/list/get';
    let req = {
      "room_id": roomId
    }
    let data = await process(path, req);
    if (!data.result.is_success) {
      return null;
    }
    return {
      roomId: data.room_id,
      roomUserCount: data.room_user_count,
      roomUserList: data.room_user_list.map(user => {
        return {
          characterId: user.character_id,
          id: user.id,
          nickname: user.nickname
        }
      })
    };
  },


  getRoomList: async () => {

    let path = '/v1/room/list/get';
    let data = await process(path);
    if (!data.result.is_success) {
      return null;
    }
    return {
      roomCount: data.room_count,
      roomList: data.room_list.map(room => {
        return {
          creatorId: room.creator_id,
          description: room.description,
          hasPassword: room.has_password,
          id: room.id,
          name: room.name,
          purposeId: room.purposeId,
          roomUrl: room.room_url
        }
      })
    };
  },



  createRoom: async (name, purposeId, presetId, hasPassword, password, creatorId) => {

    let path = '/v1/room/create';
    let req = {
      name : name,
      purpose_id : purposeId,
      preset_id : presetId,
      has_password : hasPassword,
      password : password,
      creator_id : creatorId
    }
    let data = await process(path, req);
    if (!data.result.is_success) {
      return false;
    }
    return true;
  },

  removeRoom: async (roomId) => {

    let path = '/v1/room/remove';
    let req = {
      id : roomId,
    }
    let data = await process(path, req);
    if (!data.result.is_success) {
      return false;
    }
    return true;
  },

  exitRoom: async (roomId) => {

    let path = '/v1/room/exit';
    let req = {
      id : roomId,
    }
    let data = await process(path, req);
    if (!data.result.is_success) {
      return false;
    }
    return true;
  },

}
