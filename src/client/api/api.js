import axios from "axios";
import CentiToken from "./CentiToken";
import {setUserId} from "../redux/features/account/accountSlice";
import moment from "moment";

let dispatch;

let process = async (path, data = {}, accessToken = '') => {
  let req = {
    method: 'post',
    url: 'http://dev-centimeter-api.tenuto.co.kr:24242' + path,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    data: data
  };
  try {
    let {data} = await axios(req);
    if (data.result.is_success) {
      return data;
    } else {
      console.log("server return error", data);
      return data;
    }
  } catch (e) {
    console.log("error occurred", e);
    return {
      result: {is_success: false}
    };
  }
}

let processAuth = async (path, data = {}) => {

  //{accessToken} 확인 로직이 변경되지 않는 한 {accessToken}이 존재하면 유효해야한다.
  let accessToken = CentiToken.getAccessToken();
  if (!accessToken) {
    let path = '/v1/user/access_token/refresh';
    const refreshToken = CentiToken.getRefreshToken();
    let req = {
      "refresh_token": refreshToken
    }
    let data = await process(path, req);
    if (!data.result.is_success) {
      //로그아웃 처리 필요
      dispatch(setUserId(null));
      return data;
    }
    accessToken = data.access_token;
    CentiToken.save(data.access_token, resp.expires_at, resp.refresh_token);
  }

  return await process(path, data, accessToken);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const api = {

  setDispatch: (value) => {
    dispatch = value;
  },

  login: async (accountType, accountToken) => {
    let path = '/v1/user/login';
    let req = {
      account_type: accountType,
      account_token: accountToken
    }
    let data = await process(path, req);
    if (!data.result.is_success) {
      return false;
    }
    CentiToken.save(data.access_token, data.expires_at, data.refresh_token);
    return true;
  },

  logout: async () => {
    //서버 측 미구현
    let path = '/v1/user/logout';
    let data = await process(path);
    if (!data.result.is_success) {
      return false;
    }
    CentiToken.remove();
    return true;
  },

  updateProfile: async (nickname, characterId) => {
    let path = '/v1/user/update';
    let req = {
      "nickname": nickname,
      "character_id": characterId
    }
    let data = await process(path, req);
    if (!data.result.is_success) {
      return false;
    }
    return true;
  },

  getProfile: async (userId,) => {

    let path = '/v1/user/get';
    let req = {
      "user_id": userId
    }
    let data = await process(path, req);
    if (!data.result.is_success) {
      return null;
    }
    return {
      accountId: data.account_id,
      accountType: data.account_type,
      emailAddress: data.email_address,
      id: data.id,
      nickname: data.nickname,
      characterId: data.character_id
    };
  },

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



  getUser2: async (userId, passwd) => {

    let path = '/v1/setting/room_preset/get';
    let req = {
      user_id: userId,
      passwd: passwd
    }
    await sleep(3000);
    let resp = await processAuth(path, req);
    if (!resp) {
      return null;
    }
    return resp.room_preset_list.map((el) => {
      return {
        description: el.description,
        id: el.id,
        name: el.name,
        resource: el.resource
      }
    })
  }
};

export default api;
