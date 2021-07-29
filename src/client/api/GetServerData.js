import axios from 'axios';
import {Config} from '../lib/Utils';

export default function GetServerData(
  data,
  url,
  processResultFunc,
  processFailFunc = null,
) {
  let config = {
    method: 'POST',
    url: `${Config.apiDomain}${url}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  console.log("REQ", data);
  axios(config).then((response) => {
    console.log("API", url, response.status, JSON.stringify(response.data));
    if (response.data.result.is_success) {
      processResultFunc(response.data);
    } else {
      processFailFunc(response.data);
    }
  }).catch(function (error) {
    console.log("error:" + JSON.stringify(error))
  });
}
