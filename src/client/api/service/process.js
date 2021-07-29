import axios from "axios";
import CentiToken from "../CentiToken";
import {setUserId} from "../../redux/features/account/accountSlice";

let dispatch;

export const process = async (path, data = {}, accessToken = '') => {
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

export const processAuth = async (path, data = {}) => {

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
    CentiToken.save(data.access_token, data.expires_at, data.refresh_token);
  }

  return await process(path, data, accessToken);
}

export const setDispatch = (value) => {
  dispatch = value
}
