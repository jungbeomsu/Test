import React, { useState} from 'react';
import './GameCanvas.css';
import Chatting from "./Chatting.jsx";
import InviteModal from "./InviteModal.jsx";
import SettingModal from "./SettingModal.jsx";
import {profileIconM, settingIcon, inviteIcon} from "../resources/images";
import {useSelector} from "react-redux";

export default function GameCanvas () {
  const [modalIsOpen, setIsOpen] = useState({
    invite: false,
    setting: false,
  })

  const [settingIndex, setSettingIndex] = useState(1);

  const common = useSelector(({common}) => common)

  const test = "이파일은 커밋을 추가하기위한 테스트 파일입니다"

  const GameBranchCommit = "게임 캔바스 컴포넌트에 커밋 변수를 추가했습니다"

  const JIM_NAME = "짐이 추가해준 새로운 이름 변수입니다 잘사용하세요";

  console.log("그렇죠 이렇게 따른 안전한 작업 환경에서 서로 같은 파일을 복사해서 다른곳을 수정하는겁니다.")

  function openModal(type) {
    switch(type) {
      case "invite":
        setIsOpen({...modalIsOpen, invite: true})
        break;
      case "setting":
        setIsOpen({...modalIsOpen, setting: true})
    }
  }

  function closeModal(type) {
    switch(type) {
      case "invite":
        setIsOpen({...modalIsOpen, invite: false})
        break;
      case "setting":
        setIsOpen({...modalIsOpen, setting: false})
    }
  }



  return (
    <div style={{position: "relative", width: "100vw", height: "100vh"}} className="game-container">
      <Chatting />

      <div style={{position:"absolute", top: "30vh", left: "11px", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "white", fontSize: "14px", zIndex: 999}}>
        <div style={{display: "flex", alignItems: "center", marginBottom: "20px"}}>
          <div style={{width: "122px", height: "46px", borderRadius: "24px", backgroundColor: "#47335F", display: "flex", alignItems: "center", padding: "11px 11px"}}>
            <div style={{position: "relative", marginRight: "12px"}}>
              {profileIconM}
              <div style={{width: "10px", height: "10px", backgroundColor: "#00FF47", borderRadius: "50%", position: "absolute", bottom: 0, right: 0, border: "2px solid white"}}></div>
            </div>
            <div
              onClick={() => {
                setSettingIndex(1);
                openModal("setting")
              }}
              style={{lineHeight: "15px"}}>
              {common.nickname}
              <div style={{color: "#C7C7C7", fontSize: "10px"}}>개인 설정 ></div>
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            setSettingIndex(4);
            openModal("setting")
          }}
          style={{display: "flex", alignItems: "center", marginBottom: "20px"}}>
          <div style={{width: "122px", height: "46px", borderRadius: "24px", backgroundColor: "#47335F", display: "flex", alignItems: "center", padding: "11px 11px"}}>
            <div style={{marginRight: "12px"}}>
              {settingIcon}
            </div>
            공간 설정
          </div>
        </div>
        <div
          onClick={() => openModal("invite")}
          style={{display: "flex", alignItems: "center", marginBottom: "20px"}}>
          <div style={{width: "122px", height: "46px", borderRadius: "24px", backgroundColor: "#47335F", display: "flex", alignItems: "center", padding: "11px 11px"}}>
            <div style={{marginRight: "12px"}}>
              {inviteIcon}
            </div>
            친구 초대
          </div>
        </div>
      </div>

      <canvas id="canvas" style={{width: "100%", height: "100%", position: "absolute"}} />

      {modalIsOpen.invite ?
        <InviteModal modalIsOpen={modalIsOpen} closeModal={() => closeModal("invite")}/>
        : <></>}

      {modalIsOpen.setting ?
        <SettingModal modalIsOpen={modalIsOpen} closeModal={() => closeModal("setting")} settingIndex={settingIndex} setSettingIndex={setSettingIndex}/>
        : <></>}
    </div>
  );
}


