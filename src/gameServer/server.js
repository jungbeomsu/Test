import socketIO from 'socket.io';
import {Lib} from 'lance-gg';
// import TownServerEngine from "./TownServerEngine";
import TownServerEngine2 from "./TownServerEngine2";
import http from "http";
import fs from "fs";
import https from "https";
import Express from "express";
import Game from "../common/Game";
import checkAuth from "./components/middleware/checkAuth";
import {logger} from "./components/utils/logger";


export function setUpServerEngine(httpServer) {
  let io = socketIO(httpServer);
  const gameEngine = new Game({traceLevel: Lib.Trace.TRACE_DEBUG})
  const serverEngine = new TownServerEngine2(io, gameEngine, {debug: {}, updateRate: 6, timeoutInterval: 0});

  serverEngine.start();

  return serverEngine;
}

export function setUpHttpsServer(app) {
  if (process.env.NODE_ENV === 'none') {
    logger.info('setUpHttpsServer localhost mode');
    return http.createServer(app);
  } else if (process.env.NODE_ENV === 'production') {
    logger.info('setUpHttpsServer production mode');
    const credentials = {
      cert: fs.readFileSync('./game-fullchain.pem'),
      key: fs.readFileSync('./game-privkey.pem'),
    };
    return https.createServer(credentials, app);
  } else if (process.env.NODE_ENV === 'development') {
    logger.info('setUpHttpsServer development mode');
    const credentials = {
      cert: fs.readFileSync('./game-fullchain.pem'),
      key: fs.readFileSync('./game-privkey.pem'),
    };
    return https.createServer(credentials, app);
  }
}


export function setUpGameApiRouter(serverEngine) {
  const router = Express.Router();

  // server stats
  router.get('/serverInfo', (req, res) => {
    serverEngine.gameStatus().then(gameStatus => {
      res.json(gameStatus);
    });
  })

  // moderation tools
  router.post('/banPlayer', checkAuth, (req, res) => {
    const {room, player} = req.body;
    if (room === undefined || player === undefined) {
      return res.status(200).json({
        "result": {
          "is_success": false,
          "err_message": "잘못된 형식의 요청입니다.",
        }
      })
    }
    serverEngine.banPlayer(req.body.room, req.body.player.toString(), res.locals.userId).then((banned) => {
      res.status(200).send(banned);
    }).catch((e) => {
      logger.warn(e);
      res.status(400).send();
    });
  });
  router.post('/unbanPlayer', checkAuth, (req, res) => {
    serverEngine.unbanPlayer(req.body.room, req.body.userId, res.locals.userId).then((banned) => {
      res.status(200).send(banned);
    }).catch(() => {
      res.status(400).send();
    });
  })
  router.post('/setRoomClosed', checkAuth, (req, res) => {
    serverEngine.setRoomClosed(req.body.room, res.locals.userId, req.body.closed).then(() => {
      res.status(200).send();
    }).catch(() => {
      res.status(400).send();
    });
  })
  router.post('/changePassword', checkAuth, (req, res) => {
    const {room, newPassword} = req.body;
    if (room === undefined) {
      return res.json({
        "result": {
          "is_success": false,
          "err_message": "잘못된 요청입니다.",
        }
      });
    }
    serverEngine.changePassword(room, newPassword, res.locals.userId).then(() => {
      return res.json({
        "result": {
          "is_success": true,
        }
      });
    }).catch((e) => {
      logger.warn(e);
      return res.json({
        "result": {
          "is_success": false,
          "err_message": '처리 실패',
        }
      });

    });
  })
  router.post('/setModMessage', checkAuth, (req, res) => {
    serverEngine.setModMessage(req.body.room, req.body.password, req.body.message).then(() => {
      res.status(200).send();
    }).catch(() => {
      res.status(400).send();
    });
  });
  router.get('/apitest', checkAuth, (req, res) => {
    logger.http(' TESTING');
    res.status(200).send("GOOD");
  })

  router.post('/apitest', checkAuth, (req, res) => {
    logger.http('' + JSON.stringify(req.body.roomId));
    res.status(200).send("GOOD");
  })

  return router;
}
