import React, { useState, useEffect } from 'react';
import GameNamesContainer from './GameNamesContainer.jsx';
import GameChangeCharacter from './GameChangeCharacter.jsx';
import GameChat from './GameChat.jsx';

import { localPreferences } from '../LocalPreferences.js';

import './GameCanvas.css';
import { updateUserData } from '../userData.js';

export default function GameCanvas (props) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showMember, setShowMember] = useState(false);
  const [showChatting, setShowChatting] = useState(false);
  const [memberName, setMemberName] = useState(undefined);

  useEffect(() => {
    let userData = localPreferences.get("user");
    if (userData && !userData["seenTutorial"]) {
      setShowTutorial(true);
    }
  }, []);

  function seenTutorial() {
    setShowTutorial(false);
    updateUserData({"seenTutorial": true});
  }

  let linkContainer = <div className="ot-link-container">
  </div>;
  if(props.hasLinks){
    linkContainer = <div className="ot-link-container">
      <p><a href={props.url1}>{props.name1}</a></p>
      <p><a href={props.url2}>{props.name2}</a></p>
    </div>;
  }

  let sampleArr = [
    {id: 1, name: "내 닉네임", status: "online"},
    {id: 2, name: "친구 닉네임", status: "online"},
    {id: 3, name: "상사 닉네임", status: "online"},
    {id: 4, name: "다른사람 닉네임", status: "offline"},
    {id: 5, name: "누구 닉네임", status: "online"},
  ]

  let chattingData = [
    {name: "내 닉네임", time: "오후 2:09", chatLogs: ['모두들 ~ ', '오늘 하루도 수고하셨고 내일도 수고하자 ~ ']},
    {name: "친구 닉네임", time: "오후 2:10", chatLogs: ['모두들 ~ ', '오늘 내일도 수고하셨고 모레도 수고하자 ~ ']},
    {name: "상사 닉네임", time: "오후 2:11", chatLogs: ['모두들 ~ ', '오늘 사흘도 수고하셨고 나흘도 수고하자 ~ ']},
    {name: "다른사람 닉네임", time: "오후 2:12", chatLogs: ['모두들 ~ ', '오늘 나흘도 수고하셨고 닷새도 수고하자 ~ ']},
    {name: "누구 닉네임", time: "오후 2:13", chatLogs: ['모두들 ~ ', '오늘 닷새도 수고하셨고 엿새도 수고하자 ~ ']},
  ]

  console.log('memberName', memberName);

  return (
    <div style={{position: "relative"}} className="game-container">
      {linkContainer}
      <div style={{position:"absolute", top: "40px", right: "40px", width: "244px", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
        <div

          style={{height: !showMember && "55px", borderRadius: "19px", backgroundColor: "rgba(0,0,0,0.6)", color: "#DDDDDD", fontSize: "14px", display: "flex", flexDirection: "column", padding: "15px 20px", marginBottom: "12px"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            참여 멤버 {sampleArr.length}
            <div
              onClick={() => setShowMember(!showMember)}
              style={{width: "12px", height: "12px", backgroundColor: "red", borderRadius: "50%"}}>
          </div>

          </div>

          {showMember &&
            <div style={{display: "flex", flexDirection: "column", marginTop: "20px", fontSize: "16px", color: "#CCCCCC"}}>
              <div style={{display: "flex", marginBottom: "17px", alignItems: "center"}}>
                <div>
                  <div style={{width: "17px", height: "17px", borderRadius: "50%", backgroundColor: "#949494"}}></div>
                  <div style={{width: "17px", height: "17px", borderRadius: "50%", backgroundColor: "#949494"}}></div>
                </div>
                <div>
                  <div style={{width: "17px", height: "17px", borderRadius: "50%", backgroundColor: "#949494"}}></div>
                  <div style={{width: "17px", height: "17px", borderRadius: "50%", backgroundColor: "#949494"}}></div>
                </div>

                <div
                  style={{marginLeft: "8px"}}>
                  단체 채팅
                </div>
              </div>

              {sampleArr.map((item) => {
                return (
                  <div
                    onClick={() => setMemberName(item.name)}
                    key={item.id} style={{display: "flex", marginBottom: "17px"}}>
                    <div style={{width: "36px", height: "36px", backgroundColor: "#949494", borderRadius: "50%", position: "relative"}}>
                      <div style={{width: "12px", height: "12px", backgroundColor: item.status === "online" ? "#00FF47" : "#FF6B00", borderRadius: "50%", position: "absolute", bottom: 0, right: 0, border: "2px solid white"}}>
                      </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", marginLeft: "8px", justifyContent: "center"}}>
                      <div style={{fontSize: "16px", width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                      }} >
                        {item.name}
                      </div>
                      <div style={{fontSize: "14px", color: "#777777"}}>
                        {item.status}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          }
        </div>

        <div
          onClick={() => memberName !== "undefined" && setShowChatting(!showChatting)}
          style={{height: !(showChatting && memberName) && "55px", borderRadius: "19px", backgroundColor: "rgba(0,0,0,0.6)", color: "#DDDDDD", fontSize: "14px", display: "flex", flexDirection: "column", padding: "15px 20px"}}>
          <div>
            단체 채팅
          </div>
          {chattingData.map((data) => {
            if (data.name == memberName && showChatting) {
              return (
                <div style={{height: "346px"}}>
                  <div style={{position: "absolute", bottom: "15px", paddingRight: "20px"}}>
                    <div style={{display: "flex"}}>
                      <div>
                        <div style={{width: "28px", height: "28px", backgroundColor: "pink", borderRadius: "50%", marginRight: "8px"}}></div>
                      </div>
                      <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{display: "flex", marginBottom: "8px", alignItems: "flex-end"}}>
                          <div style={{fontSize: "14px", color: "#EEEEEE", marginRight: "2px", width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                            {data.name}
                          </div>
                          <div style={{fontSize: "12px", color: "#AEAEAE", display: "flex", width: "70px"}}>
                            {data.time}
                          </div>
                        </div>
                        {
                          data.chatLogs.map((log) => {
                            return (
                              <div style={{borderRadius: "0px 15px 15px 15px", backgroundColor: "white", color: "black", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", marginBottom: "8px"}}>
                                {log}
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>

                    <input style={{width: "100%", borderRadius: "8px", height: "24px"}}/>
                  </div>
                </div>
              )
            }
          })
          }

        </div>

      </div>

      <div style={{position:"absolute", top: "50vh", left: "11px", width: "48px", height: "116px", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
        <div style={{width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.6)"}}></div>
        <div style={{width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.6)"}}></div>
      </div>
      <canvas id="canvas" style={{width: "100%", height: "100vh"}} />
      {
        props.inGame ?
          <>
            {/*<GameChat*/}
            {/*  sendChatMessage={props.sendChatMessage}*/}
            {/*  chatMessages={props.chatMessages}*/}
            {/*  playerInfoMap={props.playerInfoMap}*/}
            {/*  hasLinks={props.hasLinks}*/}
            {/*/>*/}
            {/*<GameNamesContainer*/}
            {/*  playerInfoMap={props.playerInfoMap}*/}
            {/*  playerVideoMap={props.playerVideoMap}*/}
            {/*  profPics={props.profPics}*/}
            {/*/>*/}
            {/*<GameChangeCharacter*/}
            {/*  setCharacterId={props.setCharacterId}*/}
            {/*  characterId={props.characterId}*/}
            {/*  currentMap={props.currentMap}*/}
            {/*/>*/}
          </>
        :
          null
      }
      {Object.keys(props.playerInfoMap).map(key =>
        <div key={key} className="map-name-container" id={"map-name-container-"+key}></div>
      )}
      <div id="blocked-text" hidden>We detect you've been blocked. Press spacebar, if you'd like to teleport out.</div>
      {
        showTutorial && props.inGame ?
          <div id="tutorial-text">
            <div>
              1) Use your arrow keys to move around <br />
              2) You only see and hear people when you move next to them (and if you can't check if your webcam is connected) <br />
              3) You can block users by hovering your mouse over their video
            </div>
            <div onClick={() => { seenTutorial() }}>
              [click to close]
              <i
                className="fas fa-times selection-icon-fas red"
                style={{position: "absolute", top: "10px", right: "10px"}}
              ></i>
            </div>
          </div>
        :
          null
      }
    </div>
  );
}
