import axios from 'axios';
import {Config} from '../lib/Utils';
import CentiToken from "./CentiToken";

export default async function GetGameServerDataWithToken(
  data,
  url,
  processResultFunc,
  processResultFailFunc = () => null,
  callCount = 0,
) {
  const refreshAccessToken = async () => {

    const refreshToken = await CentiToken.getRefreshToken();
    const config = {
      method: 'POST',
      url: `${Config.apiDomain}/v1/user/access_token/refresh`,
      headers: {'Content-Type': 'application/json'},
      data: {refresh_token: refreshToken}
    };

    axios(config).then(async response => {

      if (response.data.result.is_success) {

        await CentiToken.save(response.data.access_token, response.data.expires_at, response.data.refresh_token);
        await GetServerDataWithToken(
          data,
          url,
          processResultFunc,
          processResultFailFunc,
          1,
        );
      } else {
        await CentiToken.remove();
      }
    });
  }


  const accessToken = await CentiToken.getAccessToken();
  if (accessToken) {
    const config = {
      method: 'POST',
      url: `${Config.gameServerDomain}${url}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      data: data || ''
    };

    console.log("REQ", url, JSON.stringify(data));
    axios(config).then(response => {

      console.log("API", url, response.status, JSON.stringify(response.data));
      if (response.data.result.is_success) {
        processResultFunc(response.data);
      } else if (response.data.result.err_code === 10) {
        if (callCount === 0) {
          refreshAccessToken();
        } else {
          CentiToken.remove();
        }
      } else {
        processResultFailFunc(response.data);
      }
    }).catch(error => {
      console.log("error:" + JSON.stringify(error))
    });
  } else if (callCount === 0) {
    await refreshAccessToken();
  } else {
    await CentiToken.remove()
  }
}
