import React, {useContext, useEffect, useState} from 'react';
import {colors} from '../constants';

import ModContext from './ModContext.jsx';

import './GameVideo.css';
import './GameVideoMenu.css';
import {fullScreen, micOff, micOn, videoOff, videoOn} from "../resources/images";

function distToOpacity(distance) {
  let opacities = [1, 1, 1, 1, 0.8, 0.6, 0.4, 0.2, 0, 0, 0, 0, 0];
  return opacities[Math.floor(distance)];
}

function distToVolume(distance) {
  let volumes = [1, 1, 1, 1, 0.6, 0.5, 0.2, 0.2, 0.1, 0.1, 0.05, 0.05, 0.05];
  return volumes[Math.floor(distance)];
}

export default function GameVideo (props) {
  const [showMenu, setShowMenu] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [videoId, setVideoId] = useState(undefined);

  const { modPasswordCorrect } = useContext(ModContext);

  useEffect(() => {
    let video = document.getElementById("video-" + props.id);
    if ("srcObject" in video) {
      if (props.stream) {
        video.srcObject = props.stream;
      }
    } else {
      video.src = window.URL.createObjectURL(props.stream); // For older browsers
    }
    video.play();
  }, [props.stream]);

  useEffect(() => {
    let video = document.getElementById("video-" + props.id);
    if (props.distance) {
      if (distToOpacity(props.distance) !== undefined) {
        video.parentElement.parentElement.style.opacity = distToOpacity(props.distance);
      }
      if (distToVolume(props.distance) !== undefined) {
        video.volume = distToVolume(props.distance);
      }
    }
  }, [props.distance]);

  function toggleVideoEnabled() {
    props.setVideoEnabled(!props.videoEnabled);
  }

  function toggleAudioEnabled() {
    props.setAudioEnabled(!props.audioEnabled);
  }

  function toggleBlocked() {
    props.setBlocked(!props.blocked);
  }

  function toggleFullscreenEnabled() {
    setIsFullScreen(!isFullScreen);
  }

  let color = colors[parseInt(props.id) % colors.length];

  console.log(videoId, isFullScreen);

  let videoMenu = (
    <div>
      <div onClick={() => {
        toggleFullscreenEnabled()
        setVideoId(props.id)
      }} className="othervideo-fullscreen-control">
        <div style={{width: "90px", height: "28px", padding: "8px 3px", borderRadius: "8px", backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", textAlign: "center"}}>
          <div style={{marginRight: "7px"}}>{fullScreen}</div>
          <div style={{fontSize: "13px", color: "white"}}>전체 화면</div>
        </div>
      </div>
      <div className="othervideo-stream-controls">
        <div onClick={() => toggleAudioEnabled()} style={{marginRight: "12px"}} children={micOn}></div>
        <div onClick={() => toggleVideoEnabled()} children={videoOn}></div>
      </div>
    </div>
  );

  let name = props.playerInfo && props.playerInfo["name"] ? props.playerInfo["name"] : "";
  let id = props.playerInfo && props.playerInfo["publicId"] ? props.playerInfo["publicId"] : "";

  let displayName = name;
  if (modPasswordCorrect) displayName = name + "#" + id.substr(0, 6);
  return (
    <div
      style={{
        margin: "0 8px",
        width: '100%',
        borderRadius: "20px",
      }}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}>
      <div style={{position: "relative", width: '100%'}}>
        <video id={"video-" + props.id} style={{width: '150px'}}/>
        { showMenu ? videoMenu : null }
        <div style={{
          height: "23px",
          padding: "4px 6px",
          borderRadius: "12px",
          backgroundColor: "rgba(0,0,0,0.6)",
          position: "relative",
          bottom: 10,
          right: 10,
          display: "flex",
          alignItems: "center",
          textAlign: "center"
        }}>
            <span style={{color: "white", fontSize: "11px", display: "flex", alignItems: "center"}}>
              <div style={{marginRight: "2px"}} children={!props.audioEnabled && micOff} />
              <div style={{marginRight: "2px"}} children={!props.videoEnabled && videoOff} />
              다른사람 ({props.id})
            </span>
        </div>
      </div>
      <div className="name-video-container" style={{color: color}}>
        {displayName}
      </div>
    </div>
  );
}
