import {setUpGameApiRouter, setUpServerEngine, setUpHttpsServer} from './server.js';
import express from "express";
import cors from "cors";

const corsOptions = process.env.NODE_ENV === 'none' ? {
  origin: 'http://localhost:3100',
  credentials: true,
  optionsSuccessStatus: 200,
} : {
  origin: 'https://dev-town-http.tenuto.co.kr', // 접근 권한을 부여하는 도메인
  credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
  optionsSuccessStatus: 200 // 응답 상태 200으로 설정
};


const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors(corsOptions));

const httpServer = setUpHttpsServer(app);

const serverEngine = setUpServerEngine(httpServer);
const gameServerRequestRouter = setUpGameApiRouter(serverEngine);

app.use(gameServerRequestRouter);

// exports.gameServer = httpServer;
export default httpServer
