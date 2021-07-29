import {process} from "./process";

export const setting = {

  getGameServer: async () => {
    let path = '/v1/setting/game_server/get';
    let data = await process(path);
    if (!data.result.is_success) {
      return null;
    }
    return data.game_server_url;
  },
}
