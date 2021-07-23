import { localPreferences } from './LocalPreferences';
import { roomNameMap } from './constants';
import axios from 'axios';
import {Key} from "ts-keycode-enum";

export function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

export function max(a, b) {
  return a >= b ? a : b;
}

export function isProd() {
  return window.location.hostname.includes("BLANK") || window.location.hostname.includes("theonline.town");
}

export function getSubDomain() {
  let subDomain = window.location.hostname.split(".")[0];
  if (subDomain !== "town" && subDomain !== "theonline" && isProd()) {
    return subDomain;
  }
  return "";
}

export function getWhichPublic() {
  let whichPublic = 1;
  let publicRoomData = localPreferences.get("public");
  if (publicRoomData && publicRoomData["whichPublic"]) {
    whichPublic = publicRoomData["whichPublic"];
  }
  return whichPublic;
}

export function getRoomFromPath() {
  let temp = decodeURI(window.location.pathname).split("/");
  if (temp.length >= 3) {
    let toReturn = temp.slice(1).join("\\");
    if (/^(pub\\.*)$/.test(toReturn)) {
      return toReturn + getWhichPublic();
    }
    // private room
    return toReturn;
  }
  // homepage room
  if (getSubDomain()) {
    return "pub\\" + getSubDomain() + getWhichPublic();
  }

  if (isProd()) {
    return "public" + getWhichPublic();
  } else {
    return "publicdev" + getWhichPublic();
  }
}

export function getRoomNameFromPath() {
  let temp = decodeURI(window.location.pathname).split("/");
  let name = temp[temp.length - 1];
  if (name) {
    return name;
  }
  if (getSubDomain()) {
    return roomNameMap[getSubDomain()];
  }
  return "Public Room";
}

export function getNameFromRoom(room) {
  let temp = room.split("\\");
  if (temp.length >= 2) {
    return temp[temp.length - 1];
  }
  let publicName = room.substr(0, room.length - 1);
  if (publicName in roomNameMap) {
    return roomNameMap[publicName];
  }
  return publicName;
}

export function getURLFromRoom(room) {
  let temp = room.split("\\");
  if (temp.length >= 2) {
    return 'BLANK' + temp[0] + '/' + temp[1];
  }
  let publicName = room.substr(0, room.length - 1);
  return 'https://' + publicName + 'BLANK';
}

export function isPublic() {
  return /^(public.*)$/.test(getRoomFromPath()) || /^(pub\\.*)$/.test(getRoomFromPath());
}

export function makeId(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function hexToRGB(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

function getDirectionBetweenCoors(start, end){
  let dx = start.x - end.x;
  let dy = start.y - end.y;
  if(dx == 0 && dy == 1){
    return "up";
  } else if (dx == 0 && dy == -1){
    return "down";
  } else if (dx == 1 && dy == 0){
    return "left";
  } else if (dx == -1 && dy == 0){
    return "right"
  } else{
    console.warn(`weird position comparison`);
  }
}

export function convertPathToDirections(paths) {
  const result = [];
  for (let i = 1; i < paths.length; i += 1) {
    const dir = getDirectionBetweenCoors(paths[i-1], paths[i]);
    result.push(dir)
  }
  return result;
  // for i = 1 to paths.length-1;
  // - currentPoint와 nextPoint를 비교해서 nextDirection을 dirs에 Push
}

export function calculateShortestPath(map, stX, stY, endX, endY) {
    if (map[endY][endX] !== 0) {
      // console.log('cannot go');
      return [];
    }
  let dx = [0, -1, 0, 1];
  let dy = [1, 0, -1, 0];
  let Q = [];
  let visited = {};
  visited[stX] = {};
  visited[stX][stY] = [{x: stX, y: stY}];
  Q.push({x: stX, y: stY});
  // let cnt = 0;
  while (Q.length !== 0) {
    // cnt+=1;
    // if(cnt > 30) return [];
    //   console.log(Q);
    const cur = Q.shift();
    if(cur.x === endX && cur.y === endY){
      return visited[cur.x][cur.y];
    }
    // console.log('poped: ', cur.x, cur.y);
    for (let i = 0; i < 4; i++) {
      let nX = dx[i] + cur.x;
      let nY = dy[i] + cur.y;
      // console.log('check: ', nX, nY);
      if (0 <= nY && nY < map.length && 0 <= nX && nX <= map[nY].length) {
        if(map[nY][nX] !== 1){
          if(visited[nX]){
            if(visited[nX][nY]){
              continue;
            }else{
              visited[nX][nY] = [...visited[cur.x][cur.y], {x: nX, y: nY}];
              Q.push({x: nX, y: nY});
            }
          } else{
            visited[nX] = {}
            visited[nX][nY] = [...visited[cur.x][cur.y], {x: nX, y: nY}];
            Q.push({x: nX, y: nY});
          }
        }
      }
    }
  }
  return [];
}

export function createKeyEventFromDir(dir){
  switch (dir) {
    case "up":
      return {
        bubbles: true,
        cancelable: true,
        char: Key.UpArrow, // ?
        key: Key.UpArrow, // ?
        shiftKey: true,
        keyCode: Key.UpArrow,
      }
    case "down":
      return {
        bubbles: true,
        cancelable: true,
        char: Key.DownArrow, // ?
        key: Key.DownArrow, // ?
        shiftKey: true,
        keyCode: Key.DownArrow,
      }
    case "right":
      return {
        bubbles: true,
        cancelable: true,
        char: Key.RightArrow, // ?
        key: Key.RightArrow, // ?
        shiftKey: true,
        keyCode: Key.RightArrow,
      }
    case "left":
      return {
        bubbles: true,
        cancelable: true,
        char: Key.LeftArrow, // ?
        key: Key.LeftArrow, // ?
        shiftKey: true,
        keyCode: Key.LeftArrow,
      }
    default:
      return null;
  }
}
