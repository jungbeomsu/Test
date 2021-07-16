import {
  ServerEngine,
  TwoVector
} from 'lance-gg';
import osu from 'node-os-utils';
import {directionMap, VIDEO_THRESHOLD} from '../common/constants';
import {collisionMap} from '../common/maps';
import {Player} from '../common/gameObjects';
import {characterMap} from '../common/maps';
import {getPlayerDistance} from '../common/utils';
import RoomService from "./components/room/roomService";
import AuthService from "./components/auth/authService";

export default class TownServerEngine2 extends ServerEngine {

  constructor(io, ge, options) {
    super(io, ge, options);
    this.RoomService = new RoomService();
    this.AuthService = new AuthService();
  }

  assignPlayerToRoom(playerId, roomName, userId) {
    super.assignPlayerToRoom(playerId, roomName);
    this.playerToRoom[playerId] = roomName;
    this.playerInfo[roomName][playerId] = {userId: userId};
  }

  createRoom(room) {
    if (!this.initialized) {
      this.playerInfo = {};
      this.playerToRoom = {};
      this.playerToMap = {};
      this.playerToSocket = {};
      this.playerNeedsInit = {};
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
    socket.on('roomId', (data) => {
      let roomId = data.roomId;
      let password = data.password;
      let authToken = data.userToken;
      let userId = data.userId || 1;//TODO: client에서 보내줘야함.

      this.RoomService.canJoinToRoom(roomId, userId, socket)
        .then((room) => {
          console.log('[GameServer] Accessing RoomId: ', room.name)
          if (room.setting) {
            this.roomSettings[roomId] = room.setting;
          }

          const initialize = () => {
            //1. this.roomSettings[room]과 this.playerInfo[room]을 통해서 방이 정원 초과인지 확인하기
            if (this._checkRoomFull(roomId)) {
              socket.emit("sizeLimit", this.roomSettings[roomId]["sizeLimit"]);
              return;
            }

            //2. 정원초과가 아니니까 접속함.
            let playerId = socket.playerId;
            this.playerToMap[playerId] = room.map;
            this.createRoom(roomId); // override한 함수. 일종의 지연초기화 패턴.
            this.assignPlayerToRoom(playerId, roomId, userId);
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
                .then((tk) => this.RoomService.isAccessibleToken(tk, room.name))
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
      //TODO: 이게 뭔지 모르겠음...
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
  checkRoomWithAdmin(rawRoomName, userId) {
    return this.RoomService.getRoomWithAdmin(rawRoomName, userId)
      .then(room => {
        return Promise.resolve(room);
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }

  banPlayer(room, player, adminId) {
    if (!this.playerToSocket[player]) { //TODO: 지금 없는 사람이어도 밴할 수 있게 바꾸기.
      console.log('NOT EXIST', room, player, adminId)
      return {
        result: {
          is_success: false,
          err_message: "NOT EXIST",
        }
      }
    }
    if (!this.playerInfo[this.playerToRoom[player]]) {
      throw new Error('Not exist');
    }
    if (!this.playerInfo[this.playerToRoom[player]][player]?.userId) {
      throw new Error('Not Exist userId');
    }

    const userId = this.playerInfo[this.playerToRoom[player]][player].userId
    console.log('banPlayer Called: ', room, player, userId, adminId);
    return this.RoomService.BanPlayer(room, userId, adminId).then((bannedIDs) => {
      this.playerToSocket[player].conn.close();
      return bannedIDs;
    }).catch((e) => {
      throw e
    });
  }

  unbanPlayer(room, userId, adminId) {
    let roomFirebase = room.replace("/", "\\");
    return this.RoomService.UnBanPlayer(room, userId, adminId)
      .then((bannedIDs) => {
        return bannedIDs
      }).catch(e => {
        throw e;
      });
  }

  setRoomClosed(room, adminId, closed) {
    let roomFirebase = room.replace("/", "\\");
    return this.RoomService.setRoomClose(room, adminId, closed)
      .then(() => {
        if (closed) {
          if (this.playerInfo[roomFirebase]) {
            Object.keys(this.playerInfo[roomFirebase]).forEach(playerId => {
              this.playerToSocket[playerId].emit("roomClosed");
              this.playerToSocket[playerId].conn.close();
            });
          }
        }
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  changePassword(room, newPassword, userId) {
    console.log(room, newPassword, userId);
    return this.RoomService.changePassword(room, newPassword, userId);
  }

  setModMessage(room, password, message) {
    return this.checkRoomWithAdmin(room, password).then((r) => {
      Object.keys(this.playerInfo[room]).forEach(playerId => {
        if (this.playerToRoom[playerId] === room) {
          this.playerToSocket[playerId].emit("modMessage", message);
          this.modMessages[room] = message;
        }
      });
    });
  }

  _checkRoomFull(roomId) {
    if (this.roomSettings[roomId] && "sizeLimit" in this.roomSettings[roomId] && this.playerInfo[roomId]) {
      if (Object.keys(this.playerInfo[roomId]).length >= this.roomSettings[roomId]["sizeLimit"]) {
        return true;
      }
    }
    return false;
  }
}
