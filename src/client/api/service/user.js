import {process, processAuth} from "./process";
import CentiToken from "../CentiToken";


export const user = {

  login: async (accountType, accountToken) => {
    let path = '/v1/user/login';
    let req = {
      account_type: accountType,
      account_token: accountToken
    }
    let data = await process(path, req);
    if (!data.result.is_success) {
      return null;
    }
    CentiToken.save(data.access_token, data.expires_at, data.refresh_token);
    return data.user_id;
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
    let data = await processAuth(path, req);
    if (!data.result.is_success) {
      return null;
    }
    return {
      accountId: data.account_id,
      accountType: data.account_type,
      emailAddress: data.email_address,
      userId: data.id,
      nickname: data.nickname,
      characterId: data.character_id
    };
  },
}
