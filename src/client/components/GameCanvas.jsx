import React, {useEffect, useState} from 'react';

import {localPreferences} from '../LocalPreferences.js';
import moment from "moment";
import './GameCanvas.css';
import {updateUserData} from '../userData.js';

import Modal from 'react-modal';

let temp = [
  {
    id: 999,
    name: "오픈카톡방",
    type: "GROUP",
    chatMessages: [
      {name: "KIM", content: "내 이름은 킴이야", time: "hh-mm", url: "url"},
      {name: "ME", content: "내가 친 채팅", time: "hh-mm", url: "url"},
    ]
  },
  {
    id: 1,
    name: "김씨1",
    type: "PRIVATE",
    chatMessages: [
      {name: "KIM", content: "내 이름은 킴이야", time: "hh-mm", url: "url"},
      {name: "KIM", content: "내 이름은 킴이야", time: "hh-mm", url: "url"},
    ]
  },
  {
    id:2,
    name: "박씨2",
    type: "PRIVATE",
    chatMessages: [
      {name: "PARK", content: "내 이름은 박2이야", time: "hh-mm", url: "url"},
      {name: "PARK", content: "내 이름은 박2이야", time: "hh-mm", url: "url"},
      {name: "PARK", content: "내 이름은 박2이야", time: "hh-mm", url: "url"},
    ]
  },
  {
    id:3,
    name: "박씨3",
    type: "PRIVATE",
    chatMessages: [
      {name: "PARK", content: "내 이름은 박3이야", time: "hh-mm", url: "url"},
      {name: "PARK", content: "내 이름은 박3이야", time: "hh-mm", url: "url"},
      {name: "PARK", content: "내 이름은 박3이야", time: "hh-mm", url: "url"},
    ]
  },
  {
    id:4,
    name: "박씨4",
    type: "PRIVATE",
    chatMessages: [
      {name: "PARK", content: "내 이름은 박4이야", time: "hh-mm", url: "url"},
      {name: "PARK", content: "내 이름은 박4이야", time: "hh-mm", url: "url"},
      {name: "PARK", content: "내 이름은 박4이야", time: "hh-mm", url: "url"}
    ]
  }
]


export default function GameCanvas (props) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showMember, setShowMember] = useState(false);
  const [showChatting, setShowChatting] = useState(false);
  const [currentChatIndex, setCurrentChatId] = useState(undefined);
  const [memberName, setMemberName] = useState(undefined);
  const [hover, setHover] = useState({backgroundColor: "#636363", color: "white"});
  const [focus, setFocus] = useState({backgroundColor: "rgba(255,255,255,0.7)", color: "#636363"});
  const [myChattingData, setMyChattingData] = useState([]);
  const [myChatLogs, setMyChatLogs] = useState([]);
  const [myChat, setMyChat] = useState("");

  const [modalIsOpen, setIsOpen] = useState(false);
  const [chatType, setChatType] = useState(undefined);
  const [chattingData, setChattingData] = useState(temp)

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

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
  ]

  const onChangeHandler = (e) => {
    if (e.target.value.length > 0) {
      setFocus({
        backgroundColor: "white",
        color: "3A3A3C"
      })

      // save onChange text
      setMyChat(e.target.value);

    } else {
      setFocus({backgroundColor: "rgba(255,255,255,0.7)", color: "#636363"})
    }
  }

  const onKeyPressHandler = (e) => {
    if (e.key === "Enter") {
      const chatMessage = {name: "ME", content: myChat, time: "hh-mm", url: "url"}
      const newChattingData = chattingData.map(c => {
        if (c.id === currentChatIndex) {
          c.chatMessages.push(chatMessage);
        }
        return c;
      })
      setChattingData(newChattingData);
      e.target.value = "";
    }
  }

  useEffect(() => {
    let time = moment().format('h:mm');
    if(myChatLogs.length !==0){
      setMyChattingData([...myChattingData, {
        name: "나",
        time: time,
        chatLogs: myChatLogs,
      }]);
    }

  }, [myChatLogs])

  return (
    <div style={{position: "relative"}} className="game-container">
      {linkContainer}
      <div style={{position:"absolute", top: "40px", right: "40px", width: "224px", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
        <div
          style={{maxHeight: !showMember ? "55px" : "377px", borderRadius: "19px", backgroundColor: "rgba(0,0,0,0.8)", color: "#DDDDDD", fontSize: "14px", display: "flex", flexDirection: "column", padding: "15px 20px", marginBottom: "12px"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div style={{display: "flex", alignItems: "center"}}>
              <img style={{width: "24px", height: "24px", marginRight: "6px"}} src={"/images/users/bold.png"}/>
              참여 멤버 {sampleArr.length}
            </div>

            <div
              onClick={() => setShowMember(!showMember)}
            >
              {
                showMember ?
                  <img style={{width: "16px", height: "16px"}} src={"/images/arrow_up_gray.png"} /> :
                  <img style={{width: "16px", height: "16px"}} src={"/images/arrow_down_gray.png"} />
              }
            </div>
          </div>

          {showMember &&
          <>
            <div style={{display: "flex", flexDirection: "column", overflow: "scroll", marginTop: "20px", fontSize: "16px", color: "#CCCCCC"}}>

              {sampleArr.map((item) => {
                return (
                  <div
                    onClick={() => {
                      setShowChatting(true);
                      setCurrentChatId(chattingData.findIndex(c => c.id === item.id))
                    }}
                    key={item.id} style={{display: "flex", marginBottom: "17px"}}>
                    <div style={{position: "relative"}}>
                      <img style={{width: "32px", height: "32px"}} src={"/images/profile_image.png"} />
                      <div style={{width: "12px", height: "12px", backgroundColor: item.status === "online" ? "#00FF47" : "#FF6B00", borderRadius: "50%", position: "absolute", bottom: 0, right: 0, border: "2px solid white"}}>
                      </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", marginLeft: "8px", justifyContent: "center"}}>
                      <div style={{fontSize: "16px", width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                      }} >
                        {item.name}
                      </div>
                    </div>
                  </div>
                )
              })}

            </div>
            <div
              onMouseOut={() => setHover({backgroundColor: "#636363", color: "white"})}
              onMouseOver={() => setHover({backgroundColor: "white", color: "#636363"})}
              onClick={() => {
                setShowChatting(true);
              }}
              style={{width: "184px", minHeight: "33px", backgroundColor: hover.backgroundColor, color: hover.color, display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "8px"}}>
              그룹 채팅 시작
            </div>
          </>
          }
        </div>

        {
          showChatting ?
            <div
              style={{
                borderRadius: "19px",
                maxWidth: "224px",
                maxHeight: "432px",
                backgroundColor: "rgba(0,0,0,0.8)",
                color: "#DDDDDD",
                fontSize: "14px",
                display: "flex",
                flexDirection: "column"
              }}>

              {/* 헤더 */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 20px",
                borderBottom: "1px solid #636363"
              }}>
                <div style={{display: "flex", alignItems: "center"}}>
                  {chattingData[currentChatIndex].type === "GROUP" ?
                    <div style={{display: "flex", alignItems: "center"}}>
                      <img style={{width: "28px", height: "28px"}} src={"/images/chatting/bold.png"} />
                      그룹 채팅
                    </div> :
                    chattingData[currentChatIndex].type === "PRIVATE" ?
                      <>
                        <div style={{position: "relative", marginRight: "8px"}}>
                          <img style={{width: "28px", height: "28px"}} src={"/images/profile_image.png"}/>
                          <div style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#00FF47",
                            borderRadius: "50%",
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            border: "2px solid white"
                          }}/>
                        </div>
                        {chattingData[currentChatIndex].name}
                      </>
                      : <></>}
                </div>

                <div
                  onClick={() => setShowChatting(false)}
                >
                  <img
                    style={{width: "16px", height: "16px"}} src={"/images/close_button_gray.png"}/>
                </div>
              </div>

              <div style={{overflow: "scroll", minHeight: "325px"}}>
                {chattingData[currentChatIndex].chatMessages.map((chatMessage, index) => {
                  // chatMessages를 한바퀴 돌면서,
                  // chatMessagesGrouped 를 만든다.
                  // - chatMessagesGrouped: chatMessage가 같은 사람이 보낸거면 묶어서 한 덩어리로 만들어준 배열.
                  /*
                  * [
                  *   {name: 이름1, time: 시간, url: url, chatMsgs: ["content", "content2", "content3"] },
                  *   {name: 이름2, time: 시간, url: url, chatMsgs: ["content", "content2", "content3"] },
                  *   {name: 이름1, time: 시간, url: url, chatMsgs: ["content", "content2", "content3"] },
                  * ]
                  * */

                  // chatMessagesGrouped 를 출력한다.

                  return (
                    <div style={{padding: "16px 16px"}}>
                      <div style={{display: "flex"}}>

                        <div style={{display: "flex", flexDirection: "column", fontSize: "14px"}}>

                          {/* 아래 div가 이름, 프로필, 시간 보여주는 부분 */}
                          <div style={{
                            display: "flex",
                            marginBottom: "6px",
                            justifyContent: "flex-start",
                            alignItems: "center"
                          }}>
                            <div>
                              <img style={{width: "16px", height: "16px", marginRight: "4px"}}
                                   src={"/images/profile_image.png"}/>
                            </div>
                            <div style={{
                              color: "#EEEEEE",
                              marginRight: "2px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}>
                              {chatMessage.name}
                            </div>
                            <div style={{fontSize: "12px", color: "#AEAEAE"}}>
                              {chatMessage.time}
                            </div>
                          </div>
                          <div style={{lineHeight: "20px"}}>
                            {chatMessage.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

              </div>

              {/* 인풋 */}
              <div
                style={{
                  borderTop: "1px solid #636363",
                  paddingTop: "6px",
                  minHeight: "50px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <input
                  onChange={onChangeHandler}
                  onKeyPress={onKeyPressHandler}
                  placeholder={"메시지를 입력해주세요."}
                  style={{
                    width: "194px",
                    height: "31px",
                    borderRadius: "8px",
                    backgroundColor: focus.backgroundColor,
                    color: focus.color,
                  }}/>
              </div>
            </div>

            : <></>
        }
      </div>

      <div style={{position:"absolute", top: "30vh", left: "11px", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "white", fontSize: "14px",}}>
        <div style={{display: "flex", alignItems: "center", marginBottom: "20px"}}>
          <div style={{width: "122px", height: "46px", borderRadius: "24px", backgroundColor: "#47335F", display: "flex", alignItems: "center", padding: "11px 11px"}}>
            <div style={{position: "relative", marginRight: "12px"}}>
              <img style={{width: "24px", height: "24px"}} src={"/images/profile_image.png"}/>
              <div style={{width: "10px", height: "10px", backgroundColor: "#00FF47", borderRadius: "50%", position: "absolute", bottom: 0, right: 0, border: "2px solid white"}}></div>
            </div>
            <div style={{lineHeight: "15px"}}>
              내 닉네임
              <div style={{color: "#C7C7C7", fontSize: "10px"}}>프로필 편집 ></div>
            </div>
          </div>
        </div>
        <div style={{display: "flex", alignItems: "center", marginBottom: "20px"}}>
          <div style={{width: "122px", height: "46px", borderRadius: "24px", backgroundColor: "#47335F", display: "flex", alignItems: "center", padding: "11px 11px"}}>
            <img style={{width: "24px", height: "24px", marginRight: "12px"}} src={"/images/setting.png"}/>
            설정
          </div>
        </div>
        <div
          onClick={openModal}
          style={{display: "flex", alignItems: "center", marginBottom: "20px"}}>
          <div style={{width: "122px", height: "46px", borderRadius: "24px", backgroundColor: "#47335F", display: "flex", alignItems: "center", padding: "11px 11px"}}>
            <img style={{width: "24px", height: "24px", marginRight: "12px"}} src={"/images/invite.png"}/>
            친구 초대
          </div>
        </div>
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

      {/* inviteModal */}
      {modalIsOpen ?
        <div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={{
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                width: "460px",
                height: "370px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                padding: "50px 25px"
              }}
            }
            contentLabel="Example Modal"
          >
            <div style={{color: "#5E1CAF", fontSize: "32px", fontWeight: "bold", marginBottom: "9px"}}>LOGO</div>
            <div style={{color: "#1C1C1E", fontSize: "20px", fontWeight: "bold"}}>링크로 친구를 초대하기</div>
            <div style={{color: "#636363", fontSize: "12px", lineHeight: "17px"}}>친구를 초대하여 어 음... 멘트는 나중에 채워넣자</div>

            <div style={{marginTop: "40px", display: "flex", width: "100%", flexDirection: "column"}}>
              <div style={{color: "#636363", fontSize: "10px", marginBottom: "6px"}}>초대 링크</div>
              <div style={{marginBottom: "16px", backgroundColor: "#F0F0F0", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", paddingLeft: "16px"}}>https://gather.town/app/3YhtaxRX52c6XjkQ/tenuto2</div>
              <div style={{marginBottom: "12px", backgroundColor: "#5E1CAF", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", color: "white", justifyContent: "center"}}>초대 링크 복사하기</div>
              <div style={{color: "#636363", fontSize: "10px", display: "flex", justifyContent: "center", textDecoration: "underline"}}>나중에 초대하기</div>
            </div>
          </Modal>
        </div>
        : <></>}
    </div>
  );
}
