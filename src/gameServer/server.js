import socketIO from 'socket.io';
import {Lib} from 'lance-gg';
import TownServerEngine from "./TownServerEngine";
import http from "http";
import fs from "fs";
import https from "https";
import Express from "express";
import Game from "../common/Game";


export function setUpServerEngine(httpServer) {
  let io = socketIO(httpServer);
  const gameEngine = new Game({traceLevel: Lib.Trace.TRACE_DEBUG})
  const serverEngine = new TownServerEngine(io, gameEngine, {debug: {}, updateRate: 6, timeoutInterval: 0});

  serverEngine.start();

  return serverEngine;
}

export function setUpHttpsServer(app) {
  if (process.env.NODE_ENV === 'none') {
    console.log('[GameServer] setUpHttpsServer localhost mode');
    return http.createServer(app);
  } else if (process.env.NODE_ENV === 'production') {
    console.log('[GameServer] setUpHttpsServer production mode');
    const credentials = {
      cert: fs.readFileSync('./game-fullchain.pem'),
      key: fs.readFileSync('./game-privkey.pem'),
    };
    return https.createServer(credentials, app);
  } else if (process.env.NODE_ENV === 'development') {
    console.log('[GameServer] setUpHttpsServer development mode');
    const credentials = {
      cert: fs.readFileSync('./game-fullchain.pem'),
      key: fs.readFileSync('./game-privkey.pem'),
    };
    return https.createServer(credentials, app);
  }
}


export function setUpGameApiRouter(serverEngine){
  const router = Express.Router();

  // server stats
  router.get('/serverInfo', (req, res) => {
    serverEngine.gameStatus().then(gameStatus => {
      res.json(gameStatus);
    });
  })

  // moderation tools
  router.post('/checkModPassword', (req, res) => {
    serverEngine.checkModPassword(req.body.room, req.body.password).then((banned) => {
      res.status(200).send(banned);
    }).catch(() => {
      res.status(400).send();
    });
  });
  router.post('/banPlayer', (req, res) => {
    serverEngine.banPlayer(req.body.room, req.body.password, req.body.player).then((banned) => {
      res.status(200).send(banned);
    }).catch(() => {
      res.status(400).send();
    });
  });
  router.post('/unbanPlayer', (req, res) => {
    serverEngine.unbanPlayer(req.body.room, req.body.password, req.body.player).then((banned) => {
      res.status(200).send(banned);
    }).catch(() => {
      res.status(400).send();
    });
  })
  router.post('/setRoomClosed', (req, res) => {
    serverEngine.setRoomClosed(req.body.room, req.body.password, req.body.closed).then(() => {
      res.status(200).send();
    }).catch(() => {
      res.status(400).send();
    });
  })
  router.post('/changeModPassword', (req, res) => {
    serverEngine.changeModPassword(req.body.room, req.body.password, req.body.newPassword).then(() => {
      res.status(200).send();
    }).catch(() => {
      res.status(400).send();
    });
  })
  router.post('/changePassword', (req, res) => {
    serverEngine.changePassword(req.body.room, req.body.password, req.body.newPassword).then(() => {
      res.status(200).send();
    }).catch(() => {
      res.status(400).send();
    });
  })
  router.post('/setModMessage', (req, res) => {
    serverEngine.setModMessage(req.body.room, req.body.password, req.body.message).then(() => {
    })
  })

  return router;
}
