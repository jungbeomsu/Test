import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import { getRoomFromPath, hexToRGB } from "../utils";
import { localPreferences } from "../LocalPreferences";
import { updateRoomData } from "../userData";
import { colors } from '../constants';

import './GameSelfVideo.css';
import './GameVideoMenu.css';

import {micOff, videoOff, micOn, videoOn} from "../resources/images";

export default function GameSelfVideo (props) {
  const [nameValue, setNameValue] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  let color = colors[parseInt(props.myPlayer) % colors.length];

  useEffect(() => {
    let initData = localPreferences.get("rooms")[getRoomFromPath()];
    if (initData && "name" in initData) {
      setNameValue(initData["name"]);
    }
  }, []);

  useEffect(() => {
    let inputEl = document.getElementById("self-name-input");
    if (inputEl) {
      inputEl.style.color = color;
    }
  }, [props.myPlayer])

  useEffect(() => {
    let video = document.getElementById("self-video");
    if ("srcObject" in video) {
      if (props.stream) {
        video.srcObject = props.stream;
      }
    } else {
      video.src = window.URL.createObjectURL(props.stream); // For older browsers
    }
    video.play();
    video.muted = true;
  }, [props.stream]);

  function nameOnChange(e) {
    let newValue = e.target.value;
    if (newValue.length > 50) {
      newValue = newValue.slice(0, 50);
    }
    setNameValue(newValue);

    updateRoomData(getRoomFromPath(), {"name": newValue});
  }

  function takePicture() {
    let ownVideo = document.getElementById("self-video");
    let canvas = document.getElementById("take-picture-canvas");
    if (ownVideo && canvas) {
      let context = canvas.getContext("2d");
      let width = ownVideo.videoWidth;
      let height = ownVideo.videoHeight;
      canvas.width = width;
      canvas.height = height;
      context.drawImage(ownVideo, 0, 0, width, height);
      props.setOwnImage(context.getImageData(0, 0, width, height));
    }
  }

  let videoMenu = (
    <div className={"video-Menu"}>
        <div onClick={() => props.setAudioEnabled(!props.audioEnabled)} style={{marginRight: "12px"}} children={micOn}/>
        <div onClick={() => props.setVideoEnabled(!props.videoEnabled)} style={{marginRight: "12px"}} children={videoOn}/>
    </div>
  );

  return (
    <div
      className="vertical-container self-video-container"
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}>
        <div style={{}}>
          {/* 캠 확대 축소 임시 버튼 */}
          <div
            onClick={() => {props.setMyScreenBig(!props.myScreenBig)}}
            style={{position: "absolute", top: "-100px", width: props.myScreenBig ? "1000px" : "50px", height: "50px", backgroundColor: "red"}}>
          </div>
          <video
            id={props.myScreenBig ? "self-video-big" : "self-video"}>
            </video>
          { showMenu ? videoMenu : <></> }
            <div style={{height: 20, padding: "4px 6px", borderRadius: "11px", backgroundColor: "rgba(0,0,0,0.6)", position: "absolute", bottom: props.myScreenBig ? "-250px" : 10, right: props.myScreenBig ? "-330px" : 10, display: "flex", alignItems: "center", textAlign: "center"}}>
              <span style={{color: "white", fontSize: "11px", display: "flex", alignItems: "center"}}>
                <div style={{marginRight: "2px"}} children={!props.audioEnabled && micOff} />
                <div style={{marginRight: "2px"}} children={!props.videoEnabled && videoOff} />
                유저네임 (나)
              </span>
            </div>
          {/*}*/}
        </div>
    </div>
  )
}
