import { colors, PUBLIC_MAP } from './constants';
import {clamp, max, getSubDomain, calculateShortestPath, convertPathToDirections, createKeyEventFromDir} from './utils';
import { updateAnim } from './environmentAnimation';
import { isBlocked } from '../common/utils';
import { imageDimensionsMap, collisionMap, characterMap } from '../common/maps';
import { imageMap } from '../common/mapsResource';
import { characterIds } from './constants';
import { directionMap } from "../common/constants";
import {Key} from "ts-keycode-enum";

export var objectSizes = 64;

var lastMap;
var terrainImages = {};
var playerImages = {};

var publicStartX;
var publicStartY;

let playerMap = {}
let playersNameMap = {};

var mouseCoorX = 0;
var mouseCoorY = 0;

let currentMap;
var showNames = true;

var smooth = {
  prevX: -1,
  prevY: -1,
}

var recentDist = [];

var minDelta = 0.11;

// var directionCoors = [
//   { x: 0, y: 0 },
//   { x: 17, y: 0 },
//   { x: 34, y: 0 },
//   { x: 125, y: 0 },
//   { x: 143, y: 0 },
//   { x: 51, y: 0 },
//   { x: 69, y: 0 },
//   { x: 160, y: 0 },
//   { x: 178, y: 0 },
// ];

var directionCoors = [
  { x: 0, y: 0 },
  { x: objectSizes, y: 0 },
  { x: objectSizes * 2, y: 0 },
  { x: objectSizes * 7, y: 0 },
  { x: objectSizes * 8, y: 0 },
  { x: objectSizes * 4, y: 0 },
  { x: objectSizes * 5, y: 0 },
  { x: objectSizes * 10, y: 0 },
  { x: objectSizes * 11, y: 0 },
];

var curCanvasWidth = 0;
var curCanvasHeight = 0;

export function drawInit(setDestinations) {
  // TODO: optimization, only load when necessary and not all at once
  let canvas = document.getElementById("canvas");


  canvas.onmousemove = (e) => {
    mouseCoorX = e.clientX - canvas.getBoundingClientRect().x;
    mouseCoorY = e.clientY - canvas.getBoundingClientRect().y;
  }
  canvas.ondblclick = (e) => {
    if (!currentMap) return;

    let w = document.getElementById("canvas").offsetWidth;
    let h = document.getElementById("canvas").offsetHeight;
    let mouseDoubleClickX = e.clientX - canvas.getBoundingClientRect().x;
    let mouseDoubleClickY = e.clientY - canvas.getBoundingClientRect().y;
    let tx = smooth.prevX * objectSizes + (objectSizes / 2) - (w / 2);
    let ty = smooth.prevY * objectSizes + (objectSizes / 2) - (h / 2);
    tx = clamp(tx, 0, max(0, imageDimensionsMap[currentMap][0] - w - 1));
    ty = clamp(ty, 0, max(0, imageDimensionsMap[currentMap][1] - h - 1));
    const tileX = Math.floor((tx + mouseDoubleClickX) / objectSizes);
    const tileY = Math.floor((ty + mouseDoubleClickY) / objectSizes);
    const curX = Math.floor(smooth.prevX);
    const curY = Math.floor(smooth.prevY);
    console.log(`캐릭터:${curX},${curY}.목표:${tileX},${tileY}`);
    setDestinations({destX: tileX, destY: tileY, isMoving: true});
  }
}


//coordinates to draw bar indicating location of player offscreen

function offScreenLine(x, y) {

  var offset = 2;
  var radius = 8;

  var a1 = (Math.atan2(-200, 300) + (2 * Math.PI)) % (2 * Math.PI); //top right
  var a2 = (Math.atan2(200, 300) + (2 * Math.PI)) % (2 * Math.PI); //bottom right
  var a3 = (Math.atan2(200, -300) + (2 * Math.PI)) % (2 * Math.PI); //bottom left
  var a4 = (Math.atan2(-200, -300) + (2 * Math.PI)) % (2 * Math.PI); //top left

  var angle = (Math.atan2((y - 200), (x - 300)) + (2 * Math.PI)) % (2 * Math.PI);

  if ((a2 <= angle) && (angle < a3)) { //bottom wall
    var new_x1 = 300 + (200 * Math.tan((0.5 * Math.PI) - angle)) - radius;
    var new_y1 = -offset + 400;
    var new_x2 = new_x1 + (2 * radius);
    var new_y2 = new_y1;
  }
  else if ((a3 <= angle) && (angle < a4)) { //left wall
    var new_x1 = offset;
    var new_y1 = 200 + (-300 * Math.tan(angle)) - radius;
    var new_x2 = new_x1;
    var new_y2 = new_y1 + (2 * radius);
  }
  else if ((a4 <= angle) && (angle < a1)) { //top wall
    var new_x1 = 300 + (-200 * Math.tan((0.5 * Math.PI) - angle)) - radius;
    var new_y1 = offset;
    var new_x2 = new_x1 + (2 * radius);
    var new_y2 = new_y1;
  }
  else { //right wall
    var new_x1 = -offset + 600;
    var new_y1 = 200 + (300 * Math.tan(angle)) - radius;
    var new_x2 = new_x1;
    var new_y2 = new_y1 + (2 * radius);
  }
  return [new_x1, new_y1, new_x2, new_y2];
}


function draw(x, y, map, myPlayer, players, objs) {
  currentMap = myPlayer.currentMap;
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var w = document.getElementById("canvas").offsetWidth;
  var h = document.getElementById("canvas").offsetHeight;

  let top_x = x * objectSizes + (objectSizes / 2) - (w / 2);
  let top_y = y * objectSizes + (objectSizes / 2) - (h / 2);
  top_x = clamp(top_x, 0, max(0, imageDimensionsMap[map][0] - w - 1));
  top_y = clamp(top_y, 0, max(0, imageDimensionsMap[map][1] - h - 1));

  var needFill = false;
  if (curCanvasWidth !== w) {
    canvas.width  = w;
    curCanvasWidth = w;
    needFill = true;
  }

  if (curCanvasHeight !== h) {
    canvas.height  = h;
    curCanvasHeight = h;
    needFill = true;
  }

  if (map !== lastMap) {
    lastMap = map;
    needFill = true;
  }

  if (needFill) {
    ctx.fillStyle = "#000020";
    ctx.fillRect(0, 0, w, h);
  }

  if (!(map in terrainImages)) {
    terrainImages[map] = new Image;
    terrainImages[map].src = require(`./${imageMap[map]}`).default;
  }

  ctx.drawImage(
    terrainImages[map],
    top_x, top_y, w, h,
    0, 0, w, h);

  // ctx.beginPath();
  // ctx.lineWidth = "4";
  // ctx.strokeStyle = "white";
  // ctx.rect(
  //   2,
  //   2,
  //   w - 4,
  //   h - 4
  // );
  // ctx.stroke();
  // ctx.closePath();

  updateAnim(map, ctx, top_x, top_y, objectSizes);

  if (Object.keys(playerImages).length === 0) {
    if (map in characterMap) {
      characterMap[map].forEach(characterId => {
        playerImages[characterId] = new Image();
        playerImages[characterId].src = require(`./${characterIds[characterId]}`).default;
      });
    } else {
      characterMap[0].forEach(characterId => {
        playerImages[characterId] = new Image();
        playerImages[characterId].src = require(`./${characterIds[characterId]}`).default;
      });
    }
  }

  // TODO fix this
  let mapNames = document.getElementsByClassName("map-name-container")
  for (let mapNameContainer of mapNames) {
    mapNameContainer.hidden = true;
  }
  //=== object drawing ===//
  if(objs.length > 0){
    // console.log(objs);
    objs.forEach(object => {
      // Animation있으면 좋겠다.....지만 renderer를 따로 만들지 않으면 되게 복잡할 듯.
      let objX = object.x;
      let objY = object.y;
      let drawX = objX * objectSizes - top_x + objectSizes / 2;
      let drawY = objY * objectSizes - top_y + objectSizes / 2;
      let circle = new Path2D();
      let radiusDivider = -0.2 * object.frames + 6.2;
      circle.arc(drawX, drawY, objectSizes/radiusDivider, 0, 2 * Math.PI);
      ctx.fillStyle = "#EEEEEE";
      ctx.fill(circle);
      // ctx.fillStyle = "#12FF00";
      // ctx.fillRect(drawX, drawY, objectSizes / 2, objectSizes / 2)
    })
  }


  players.forEach(player => {
    let direction;
    let drawX;
    let drawY;
    if (myPlayer.playerId === player.playerId) {

      direction = directionCoors[myPlayer.localDir];
      drawX = x * objectSizes - top_x;
      drawY = y * objectSizes - top_y;
    } else {
      direction = directionCoors[player.currentDirection];
      drawX = player.position.x * objectSizes - top_x;
      drawY = player.position.y * objectSizes - top_y;
    }


    if (drawX >= 0 && drawX < w && drawY >= 0 && drawY < h) {
      ctx.drawImage(
        playerImages[player.characterId],
        direction.x,
        direction.y,
        objectSizes - 2,
        objectSizes,
        drawX,
        drawY,
        objectSizes,
        objectSizes
      );

      // ctx.beginPath();
      // ctx.lineWidth = "2";
      // ctx.strokeStyle = colors[player.playerId % colors.length];
      // ctx.rect(
      //   drawX,
      //   drawY,
      //   objectSizes,
      //   objectSizes
      // );
      // ctx.stroke();

      let mapNameContainer = document.getElementById("map-name-container-" + player.playerId)
      let mousedOver =
        mouseCoorX >= drawX
        && mouseCoorX <= drawX + objectSizes
        && mouseCoorY >= drawY && mouseCoorY <= drawY + objectSizes;
      if (
        (showNames || mousedOver)
        && playersNameMap[player.playerId] && mapNameContainer
      ) {
        // Draw the name
        mapNameContainer.style.left = drawX + (objectSizes / 2) + "px";
        mapNameContainer.style.top = drawY + objectSizes + "px";
        mapNameContainer.style.border = "solid 2px " + colors[player.playerId % colors.length];
        mapNameContainer.style.transform = "translateX(-50%)";
        mapNameContainer.textContent = playersNameMap[player.playerId];
        mapNameContainer.hidden = false;
      } else if (mapNameContainer) {
        mapNameContainer.hidden = true;
      }
    }
    // else {
    //   if (!window.selectedIds || window.selectedIds[player.playerId]) {
    //     var position = offScreenLine(drawX + 10, drawY + 10);
    //     ctx.beginPath();
    //     ctx.lineWidth = "4";
    //     ctx.strokeStyle = colors[player.playerId % colors.length];
    //     ctx.moveTo(position[0], position[1]);
    //     ctx.lineTo(position[2], position[3]);
    //     ctx.stroke();
    //     ctx.closePath();
    //   }
    // }
  });

  // let blockedText = document.getElementById("blocked-text");
  // if (blockedText) {
  //   blockedText.hidden = !isBlocked(x, y, players, collisionMap[map]);
  // }
}

export function setShowNames(newShowNames) {
  if (newShowNames === undefined) {
    showNames = !showNames;
  } else {
    showNames = newShowNames;
  }
}

export function updatePlayerMap(newPlayerMap) {
  playerMap = newPlayerMap;
}

export function update(myPlayer, players, objs) {
  if (!myPlayer) {
    return;
  }

  players.forEach(player => {
    let name = "";
    if (playerMap && player.playerId in playerMap && "name" in playerMap[player.playerId]) {
      name = playerMap[player.playerId]["name"];
    }
    playersNameMap[player.playerId] = name;
  })

  if (smooth.prevX === -1 && smooth.prevY === -1) {
    smooth.prevX = myPlayer.position.x;
    smooth.prevY = myPlayer.position.y;
  }

  function getSmooth(cur, target) {

    let sign = target > cur ? 1 : -1;
    let dist = Math.abs(target - cur);
    if (dist < minDelta) {
      return target;
    } else if (dist <= 1) {
      return cur + sign * minDelta;
    } else {
      let delta = dist * minDelta;
      return cur + sign * delta;
    }
  }

  smooth.prevX = getSmooth(smooth.prevX, myPlayer.position.x);
  smooth.prevY = getSmooth(smooth.prevY, myPlayer.position.y);

  let dist = Math.sqrt(Math.pow(myPlayer.position.x - smooth.prevX, 2)
    + Math.pow(myPlayer.position.y - smooth.prevY, 2))

  if (dist > 0) {
    recentDist.push(dist);
    if (recentDist.length === 30) {

      let recentMaxDist = 0;
      recentDist.forEach((dist) => {
        if (dist > recentMaxDist) {
          recentMaxDist = dist;
        };
      });
      if (recentMaxDist > 1) {
        minDelta += 0.001;
      } else if (recentMaxDist < 1) {
        minDelta -= 0.001;
      }
      // console.log("recentMaxDist", recentMaxDist.toFixed(3), minDelta.toFixed(3));
      recentDist = [];
    }


  }

  // console.log(myPlayer.currentDirection);
  // console.log("prevSameCnt:", prevSameCnt); //너무 빠름
  // console.log("maxDist", maxDist);  //너무 느림

    // console.log("update->draw", myPlayer.position.x, smooth.prevX, myPlayer.position.y, smooth.prevY);
  // console.log("update->draw", maxDiff, myPlayer.position.x - smooth.prevX, myPlayer.position.y - smooth.prevY);
  draw(smooth.prevX, smooth.prevY, myPlayer.currentMap, myPlayer, players, objs);
}

export function publicUpdate(players, obj) {
  if (!publicStartX || !publicStartY) {
    collisionMap[PUBLIC_MAP[getSubDomain()]].forEach((row, idxY) => {
      row.forEach((element, idxX) => {
        if (element === -1) {
          publicStartX = idxX;
          publicStartY = idxY;
        }
      });
    });
  }
  draw(publicStartX, publicStartY, PUBLIC_MAP[getSubDomain()], players, obj);
}
