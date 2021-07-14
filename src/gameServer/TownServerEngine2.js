import {
  ServerEngine,
  TwoVector
} from 'lance-gg';
import bcrypt from 'bcrypt';
import osu from 'node-os-utils';
import {directionMap, VIDEO_THRESHOLD} from '../common/constants';
import {collisionMap} from '../common/maps';
import {Player} from '../common/gameObjects';
import {db, auth} from '../server/constants';

import {characterMap} from '../common/maps';
import {getPlayerDistance} from '../common/utils';
import {RoomsService} from "./components/rooms/roomsService";

export default class TownServerEngine2 extends ServerEngine {

  constructor(io, ge, options) {    super(io, ge, options);
    this.RoomsService = new RoomsService();
    this.AuthService = new AuthService();
  }

  assignPlayerToRoom(playerId, roomName) {
    super.assignPlayerToRoom(playerId, roomName);
    this.playerToRoom[playerId] = roomName;
    this.playerInfo[roomName][playerId] = {};
  }

  createRoom(room) {
    if (!this.initialized) {
      this.playerInfo = {};
      this.playerToRoom = {};
      this.playerToMap = {};
      this.playerToSocket = {};
      this.playerNeedsInit = {};
      this.playerVideoMetric = {};
      this.playerOnVideoMetric = {};
      this.modMessages = {};
      this.roomSettings = {};
      this.initialized = true;
    }
    if (!(room in this.rooms)) {
      super.createRoom(room);
      this.playerInfo[room] = {};
      this.modMessages[room] = "";
    }
  }

  initializePlayer(map, playerId, room) {
    let startX = 0;
    let startY = 0;
    collisionMap[map].forEach((row, idxY) => {
      row.forEach((element, idxX) => {
        if (element === -1) {
          startX = idxX;
          startY = idxY;
        }
      });
    });

    var newPlayer = new Player(this.gameEngine, null, {position: new TwoVector(startX, startY)});
    newPlayer.currentDirection = directionMap['stand'];
    newPlayer.currentMap = map;
    if (map in characterMap) {
      newPlayer.characterId = characterMap[map][0];
    } else {
      newPlayer.characterId = characterMap[0][0];
    }
    newPlayer.playerId = playerId;
    this.assignObjectToRoom(newPlayer, room);
    this.gameEngine.addObjectToWorld(newPlayer);
  }

  setCharacterId(playerId, characterId) {
    if (!playerId) {
      return;
    }
    let myPlayer = this.gameEngine.world.queryObject({playerId});
    if (!myPlayer) {
      return;
    }
    if (myPlayer.currentMap in characterMap) {
      if (characterMap[myPlayer.currentMap].includes(characterId)) {
        myPlayer.characterId = characterId;
      }
    } else {
      if (characterMap[0].includes(characterId)) {
        myPlayer.characterId = characterId;
      }
    }
  }

  onPlayerConnected(socket) {
    super.onPlayerConnected(socket);
    this.playerToSocket[socket.playerId] = socket;
    this.playerVideoMetric[socket.playerId] = {};
    this.playerOnVideoMetric[socket.playerId] = null;
    socket.on('roomId', (data) => {
      let roomId = data.roomId;
      let password = data.password;
      let authToken = data.userToken;

      this.RoomsService.canJoinToRoom(roomId, socket)
        .then((room) => {
          if (room === undefined) {
            console.log('로직상 unreachable인 것 같은데, 왜지.');
            return;
          }
          console.log('[GameServer] Accessing RoomId: ', room.name)
          if (room.setting) {
            this.roomSettings[roomId] = room.setting;
          }

          const initialize = () => {
            //1. this.roomSettings[room]과 this.playerInfo[room]을 통해서 방이 정원 초과인지 확인하기
            if(this._checkRoomFull(roomId)){
              socket.emit("sizeLimit", this.roomSettings[roomId]["sizeLimit"]);
              return;
            }

            //2. 정원초과가 아니니까 접속함.
            let playerId = socket.playerId;
            this.playerToMap[playerId] = room.map;
            this.createRoom(roomId); // override한 함수. 일종의 지연초기화 패턴.
            this.assignPlayerToRoom(playerId, roomId);
            if (this.playerNeedsInit[playerId]) {
              this.initializePlayer(room.map, socket.playerId, roomId);
            }
            socket.emit("serverPlayerInfo", Object.assign({"firstUpdate": true}, this.playerInfo[room]));
            socket.emit("modMessage", this.modMessages[roomId]);
            if (this.roomSettings[roomId]) {
              socket.emit("roomSettings", this.roomSettings[roomId]);
            }
          }
          if (room.hasPassword()) {
            if (password && room.comparePassword(password)) {
              initialize();
            } else if (authToken) {
              this.AuthService.verifyIdToken(authToken)
                .then((tk) => this.RoomsService.isAccessibleToken(tk, room.name))
                .then(accessible => {
                  if (accessible) {
                    initialize();
                  } else {
                    console.log("Not Accessible Token")
                  }
                }).catch(error => {
                throw new Error("error verifying token" + error.message);
              });
            } else {
              throw new Error("incorrect password/ doesnt have access");
            }
          } else {
            initialize();
          }
        }).catch(e => {
        socket.conn.close();
        console.error(e);
      })
        .then(() => {
          // alwaysExecuteThisFunction like finally in try-catch-finally pattern
        });
    })

    socket.on('initPlayer', () => {
      console.log("got initPlayer", socket.playerId);
      if (socket.playerId in this.playerToRoom) {
        this.initializePlayer(this.playerToMap[socket.playerId], socket.playerId, this.playerToRoom[socket.playerId]);
      } else {
        this.playerNeedsInit[socket.playerId] = true;
      }
    });

    socket.on("setCharacterId", (newId) => {
      this.setCharacterId(socket.playerId, newId);
    });

    socket.on('sendPrivatePrompt', data => {
      console.log("got sendPrivatePrompt");
      let roomName = data.room || "";
      let password = data.password || "";
      this.RoomsService.getRoom(roomName)
        .then(room => {
          if (room.compareModPassword(password)) {
            console.log("sendPrivatePrompt to ", room.name);
            Object.keys(this.playerInfo[room.name]).forEach(playerId => {
              this.playerToSocket[playerId].emit("createPrivatePrompt");
              this.playerToSocket[playerId].conn.close();
            });
          } else {
            console.log("incorrect password");
          }
        }).catch(console.error);
    });

    socket.on("playerInfo", (data) => {
      let curRoom = this.playerToRoom[socket.playerId];
      if (this.playerInfo[curRoom]) {
        Object.assign(this.playerInfo[curRoom][socket.playerId], data);
        Object.keys(this.playerInfo[curRoom]).forEach(playerId => {
          if (this.playerToRoom[playerId] === curRoom) {
            this.playerToSocket[playerId].emit("serverPlayerInfo", this.playerInfo[curRoom]);
          }
        });
      }
    });

    socket.on("videoMetric", (data) => {
      if (data.isStart) {
        this.playerVideoMetric[socket.playerId][data.playerId] = {
          "userId": data.userId,
          "time": data.time,
          "isProd": data.isProd,
        };
      } else {
        if (this.playerVideoMetric &&
          this.playerVideoMetric[socket.playerId] &&
          this.playerVideoMetric[socket.playerId][data.playerId] &&
          this.playerVideoMetric[socket.playerId][data.playerId].time) {
          let interactedTime = (data.time - this.playerVideoMetric[socket.playerId][data.playerId].time) / 1000;
          console.log("interacted for ", interactedTime);
          // logAmpEvent(data.userId, "Exit Video Call", { "duration_seconds": interactedTime }, data.isProd);
          delete this.playerVideoMetric[socket.playerId][data.playerId];
        }
      }
    });

    socket.on("onVideoMetric", (data) => {
      if (data.isStart) {
        this.playerOnVideoMetric[socket.playerId] = {
          "userId": data.userId,
          "time": data.time,
          "isProd": data.isProd,
        };
      } else {
        if (this.playerOnVideoMetric &&
          this.playerOnVideoMetric[socket.playerId] &&
          this.playerOnVideoMetric[socket.playerId].time) {
          let interactedTime = (data.time - this.playerOnVideoMetric[socket.playerId].time) / 1000;
          // logAmpEvent(data.userId, "Exit On Video Call", { "duration_seconds": interactedTime }, data.isProd);
          this.playerOnVideoMetric[socket.playerId] = null;
        }
      }
    });

    socket.on("chatMessage", (message, blockedMap) => {
      let playerId = socket.playerId;
      let myPlayer = this.gameEngine.world.queryObject({playerId});
      let players = this.gameEngine.world.queryObjects({instanceType: Player});
      let playersObj = {};
      players.forEach(player => {
        let dist = getPlayerDistance(myPlayer, player);
        if (dist) {
          playersObj = Object.assign(playersObj, dist);
        }
      })

      let curRoom = this.playerToRoom[socket.playerId];
      if (!this.playerInfo[curRoom]) {
        return;
      }
      let infoFromRoom = this.playerInfo[curRoom];
      if (!infoFromRoom) {
        return;
      }
      // TODO: DB 저장하는 코드 넣기.
      //=== none.

      Object.keys(playersObj).forEach(id => {
        if (!(id in infoFromRoom)) {
          return;
        }
        let publicId = infoFromRoom[id].publicId;
        let blocked = !publicId || (publicId in blockedMap && blockedMap[publicId]);
        //if (playersObj[id] <= VIDEO_THRESHOLD && !blocked) {
        if (!blocked) {
          this.playerToSocket[id].emit("serverChatMessage", {
            id: playerId + "",
            message: message
          });
        }
      });
    });
  }

  onPlayerDisconnected(socketId, playerId) {
    super.onPlayerDisconnected(socketId, playerId);
    let player = this.gameEngine.world.queryObject({playerId});
    if (player) {
      this.gameEngine.removeObjectFromWorld(player);
    }

    // Log video call ended metric
    let nowTime = new Date().getTime();
    // console.log(this.playerVideoMetric[playerId]);
    Object.keys(this.playerVideoMetric[playerId]).forEach(otherPlayerId => {
      let metricData = this.playerVideoMetric[playerId][otherPlayerId];
      let interactedTime = (nowTime - metricData.time) / 1000;
      // console.log("disconnect with ", otherPlayerId, "interacted for ", interactedTime);
      // logAmpEvent(metricData.userId, "Exit Video Call", { "duration_seconds": interactedTime }, metricData.isProd);
    })
    if (this.playerOnVideoMetric[playerId]) {
      let metricData = this.playerOnVideoMetric[playerId];
      let interactedTime = (nowTime - metricData.time) / 1000;
      // logAmpEvent(metricData.userId, "Exit On Video Call", { "duration_seconds": interactedTime }, metricData.isProd);
    }

    let curRoom = this.playerToRoom[playerId];
    if (this.playerInfo[this.playerToRoom[playerId]]) {
      delete this.playerInfo[curRoom][playerId];
    }

    if (this.playerInfo[curRoom]) {
      Object.keys(this.playerInfo[curRoom]).forEach(id => {
        if (this.playerToRoom[id] === curRoom) {
          this.playerToSocket[id].emit("serverPlayerInfo", this.playerInfo[curRoom]);
        }
      });
    }

    delete this.playerToSocket[playerId];
    delete this.playerToMap[playerId];
    delete this.playerToRoom[playerId];
    delete this.playerVideoMetric[playerId];
    console.log("disconnect", this.playerInfo);
  }

  async gameStatus() {
    try {
      let [cpu, memInfo] = await Promise.all([osu.cpu.usage(), osu.mem.used()])
      let gameStatus = {
        numPlayers: Object.keys(this.connectedPlayers).length,
        cpuPercentLoad: cpu,
        memLoad: memInfo.usedMemMb + "MB / " + memInfo.totalMemMb + "MB",
        roomCount: Object.keys(this.playerInfo).map(roomId => Object.keys(this.playerInfo[roomId]).length)
      }
      return gameStatus;
    } catch (err) {
      console.log("gameStatus err: ", err);
      return null;
    }
  }

  // moderation tools
  // deprecate하기
  checkModPasswordInternal(rawRoomName, password) {
    return this.RoomsService.getRoomWithModPassword(rawRoomName, password)
      .then(room => {
        return Promise.resolve(room);
      })
      .catch((e) => {
          return Promise.reject(e);
      });
  }

  // deprecated 하기. 이게 왜 checkModPassword야. getBannedIpsFromRoom이지.
  checkModPassword(room, password) {
    return this.checkModPasswordInternal(room, password).then((roomData) => {
      if (roomData.bannedIPs) {
        return Object.values(roomData.bannedIPs);
      }
      return [];
    })
  };

  banPlayer(room, password, player) {
    let roomFirebase = room.replace("/", "\\");
    if (!this.playerToSocket[player]) throw Exception;
    return this.checkModPasswordInternal(room, password).then((roomData) => {
      let newBannedIPs = {
        ...roomData.bannedIPs,
        [this.playerToSocket[player].handshake.address]: this.playerInfo[roomFirebase][player]
      }
      this.RoomsService.BanPlayer(room, data); // TODO: 업뎃이라 비동기작업. 성능 개선 고려? 근데 socket.conn.close랑 transactional. 일단 나중에 생각
      this.playerToSocket[player].conn.close();
      return Object.values(newBannedIPs);
    })
  }

  unbanPlayer(room, password, player) {
    let roomFirebase = room.replace("/", "\\");
    return this.checkModPasswordInternal(room, password).then((roomData) => {
      let banned = roomData["bannedIPs"];
      Object.keys(banned).forEach((ip) => {
        if (banned[ip]["publicId"] === player) {
          delete banned[ip];
        }
      })
      this.RoomsService.UnBanPlayer(room, banned);
      return Object.values(banned);
    })
  }

  setRoomClosed(room, password, closed) {
    let roomFirebase = room.replace("/", "\\");
    return this.checkModPasswordInternal(room, password).then((_) => {
      this.RoomsService.setRoomClose(room, closed);
      if (closed) {
        Object.keys(this.playerInfo[roomFirebase]).forEach(playerId => {
          this.playerToSocket[playerId].emit("roomClosed");
          this.playerToSocket[playerId].conn.close();
        });
      }
    });
  }

  changeModPassword(room, password, newPassword) {
    return this.checkModPasswordInternal(room, password).then(() => {
      return this.RoomsService.changeModPassword(room, newPassword)
    });
  }

  changePassword(room, password, newPassword) {
    return this.checkModPasswordInternal(room, password).then(() => {
      return this.RoomsService.changePassword(room, newPassword);
    });
  }

  setModMessage(room, password, message) {
    return this.checkModPasswordInternal(room, password).then(() => {
      Object.keys(this.playerInfo[room]).forEach(playerId => {
        if (this.playerToRoom[playerId] === room) {
          this.playerToSocket[playerId].emit("modMessage", message);
          this.modMessages[room] = message;
        }
      });
    });
  }

  _checkRoomFull(roomId) {
    if(this.roomSettings[roomId] && "sizeLimit" in this.roomSettings[roomId] && this.playerInfo[roomId]){
      if (Object.keys(this.playerInfo[roomId]).length >= this.roomSettings[roomId]["sizeLimit"]) {
        return true;
      }
    }
    return false;
  }
}
