import express from 'express';
import socketIO from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';

import https from 'https';
import http from 'http';
import fs from 'fs';
import { Lib } from 'lance-gg';
import Game from './common/Game';
import TownServerEngine from './server/TownServerEngine';

export default function setupGameServer(server, httpServer) {
  // Game Instances
  let io = socketIO(httpServer);
  const gameEngine = new Game({ traceLevel: Lib.Trace.TRACE_NONE });
  const serverEngine = new TownServerEngine(io, gameEngine, { debug: {}, updateRate: 6, timeoutInterval: 0 });

  // start the game
  serverEngine.start();

  // parse json
  server.use(bodyParser.json());

  // server stats
  server.get('/serverInfo', (req, res) => {
    serverEngine.gameStatus().then(gameStatus => {
      res.json(gameStatus);
    });
  })

  // moderation tools
  server.post('/checkModPassword', (req, res) => {
    serverEngine.checkModPassword(req.body.room, req.body.password).then((banned) => {
      res.status(200).send(banned);
    }).catch(() => {
      res.status(400).send();
    });
  });
  server.post('/banPlayer', (req, res) => {
    serverEngine.banPlayer(req.body.room, req.body.password, req.body.player).then((banned) => {
      res.status(200).send(banned);
    }).catch(() => {
      res.status(400).send();
    });
  });
  server.post('/unbanPlayer', (req, res) => {
    serverEngine.unbanPlayer(req.body.room, req.body.password, req.body.player).then((banned) => {
      res.status(200).send(banned);
    }).catch(() => {
      res.status(400).send();
    });
  })
  server.post('/setRoomClosed', (req, res) => {
    serverEngine.setRoomClosed(req.body.room, req.body.password, req.body.closed).then(() => {
      res.status(200).send();
    }).catch(() => {
      res.status(400).send();
    });
  })
  server.post('/changeModPassword', (req, res) => {
    serverEngine.changeModPassword(req.body.room, req.body.password, req.body.newPassword).then(() => {
      res.status(200).send();
    }).catch(() => {
      res.status(400).send();
    });
  })
  server.post('/changePassword', (req, res) => {
    serverEngine.changePassword(req.body.room, req.body.password, req.body.newPassword).then(() => {
      res.status(200).send();
    }).catch(() => {
      res.status(400).send();
    });
  })
  server.post('/setModMessage', (req, res) => {
    serverEngine.setModMessage(req.body.room, req.body.password, req.body.message).then(() => {
    })
  })
  server.post('/roomInfo', (req, res) => {
    const {room} = req.body;
    console.log(room);
    res.json({
      data: `${3}`,
      result: {
        is_success: true,
      }
    });
  })
}

// If this file is invoked directly
// Meant to run on the prod servers
if (require.main === module) {

  const PORT = 4000;

  if (process.env.NODE_ENV == 'none') {
    const server = express();
    const httpServer = http.createServer(server);

    server.use(cors({
      origin: 'http://localhost:3100',
      credentials: true,
      optionsSuccessStatus: 200,
    }));
    httpServer.listen(PORT);
    setupGameServer(server, httpServer);
    console.log('Localhost, http Game Server running on port 4000');

  } else if (process.env.NODE_ENV == 'development') {

    let credentials = {
      cert: fs.readFileSync('./game-fullchain.pem'),
      key: fs.readFileSync('./game-privkey.pem'),
    };
    const server = express();
    let httpsServer = https.createServer(credentials, server);
    httpsServer.listen(PORT);
    const options = {
      origin: 'https://dev-town-http.tenuto.co.kr', // 접근 권한을 부여하는 도메인
      credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
      optionsSuccessStatus: 200 // 응답 상태 200으로 설정
    };

    server.use(cors(options));
    // server.options('*', cors());
    setupGameServer(server, httpsServer);
    console.log('Dev, https Game Server running on port 4000');

  } else {

    let credentials = {
      cert: fs.readFileSync('./game-fullchain.pem'),
      key: fs.readFileSync('./game-privkey.pem'),
    };
    const server = express();
    let httpsServer = https.createServer(credentials, server);
    httpsServer.listen(PORT);
    const options = {
      origin: 'https://dev-town-http.tenuto.co.kr', // 접근 권한을 부여하는 도메인
      credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
      optionsSuccessStatus: 200 // 응답 상태 200으로 설정
    };

    server.use(cors(options));
    // server.options('*', cors());
    setupGameServer(server, httpsServer);
    console.log('Prod, https Game Server running on port 4000');
  }
}
// if (require.main === module) {
//   const PORT = process.env.port || 4000;
//   let credentials = {
//     cert: fs.readFileSync('./game-fullchain.pem'),
//     key: fs.readFileSync('./game-privkey.pem'),
//   };
//
//   console.log("Running prod https server");
//   const server = express();
//   let httpsServer = https.createServer(credentials, server);
//   httpsServer.listen(PORT);
//
//   const options = {
//     origin: 'https://dev-town-http.tenuto.co.kr', // 접근 권한을 부여하는 도메인
//     credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
//     optionsSuccessStatus: 200 // 응답 상태 200으로 설정
//   };
//
//   server.use(cors(options));
//   // server.options('*', cors());
//   setupGameServer(server, httpsServer);
// }
