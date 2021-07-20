import querystring from 'query-string';
import axios from 'axios';
import { Lib, Renderer } from 'lance-gg';
import Game from '../common/Game';
import TownClientEngine from './TownClientEngine';
import { getRoomFromPath } from './utils';
import {Config} from "./constants";
import CentiKeyboard from "./CentiKeyboard";
const qsOptions = querystring.parse(location.search);

// returns clientEngine
export default async function initClientEngine() {
  const defaults = {
    traceLevel: Lib.Trace.TRACE_NONE,
    scheduler: 'fixed',
    syncOptions: {
      sync: qsOptions.sync || 'extrapolate',
      localObjBending: 0,
      remoteObjBending: 1,
      bendingIncrements: 8,
    },
  };

  let gameServerPromise = axios.post(
    Config.apiServerPrefix + '/api/getGameServer',
    {
      room: getRoomFromPath(),
    },
  );

  let response = await gameServerPromise;

  if (response) {
    if (response.status !== 200) {
      console.error('Could not get game server URL!');
      return null;
    }
    if (response.data) {
      console.log("GAME_SERVER:", response.data);
      defaults['serverURL'] = response.data;
    } else {
      console.log('connecting to default localhost');
    }
    let options = Object.assign(defaults, qsOptions);
    let gameEngine = new Game(options);
    let clientEngine = new TownClientEngine(gameEngine, options, Renderer);

    const centiKeyboard = new CentiKeyboard();
    centiKeyboard.init(clientEngine);

    return clientEngine;
  } else {
    console.error('Call to get game server URL failed!');
    return null;
  }
}
