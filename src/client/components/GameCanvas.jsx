import React, {useEffect, useState} from 'react';

import {localPreferences} from '../LocalPreferences.js';
import './GameCanvas.css';
import {updateUserData} from '../userData.js';

import Modal from 'react-modal';
import Switch from './Switch.jsx';

let temp = [
  {
    id: 0,
    name: "오픈카톡방",
    type: "GROUP",
    chatMessages: [
      {name: "KIM", content: "내 이름은 킴이야", time: "hh:mm", url: "url"},
      {name: "나", content: "내가 친 채팅", time: "hh:mm", url: "url"},
    ]
  },
  {
    id: 1,
    name: "내 닉네임",
    type: "PRIVATE",
    chatMessages: [
      {name: "나", content: "여기는 내 메모장이야", time: "hh:mm", url: "url"},
      {name: "나", content: "아무거나 쓸 수 있어", time: "hh:mm", url: "url"},
    ]
  },
  {
    id: 2,
    name: "김씨1",
    type: "PRIVATE",
    chatMessages: [
      {name: "KIM", content: "내 이름은 킴이야", time: "hh:mm", url: "url"},
      {name: "KIM", content: "내 이름은 킴이야", time: "hh:mm", url: "url"},
    ]
  },
  {
    id:3,
    name: "박씨2",
    type: "PRIVATE",
    chatMessages: [
      {name: "PARK", content: "내 이름은 박2이야", time: "hh:mm", url: "url"},
      {name: "PARK", content: "내 이름은 박2이야", time: "hh:mm", url: "url"},
      {name: "PARK", content: "내 이름은 박2이야", time: "hh:mm+1", url: "url"},
      {name: "PARK", content: "내 이름은 박2이야", time: "hh:mm+2", url: "url"},
    ]
  },
  {
    id:4,
    name: "박씨3",
    type: "PRIVATE",
    chatMessages: [
      {name: "PARK", content: "내 이름은 박3이야", time: "hh:mm", url: "url"},
      {name: "PARK", content: "내 이름은 박3이야", time: "hh:mm", url: "url"},
      {name: "PARK", content: "내 이름은 박3이야", time: "hh:mm", url: "url"},
    ]
  },
  {
    id:5,
    name: "박씨4",
    type: "PRIVATE",
    chatMessages: [
      {name: "PARK", content: "내 이름은 박4이야", time: "hh:mm", url: "url"},
      {name: "PARK", content: "내 이름은 박4이야", time: "hh:mm", url: "url"},
      {name: "PARK", content: "내 이름은 박4이야", time: "hh:mm", url: "url"}
    ]
  }
]


export default function GameCanvas (props) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showMember, setShowMember] = useState(false);
  const [showChatting, setShowChatting] = useState(false);
  const [currentChatIndex, setCurrentChatId] = useState(undefined);
  const [hover, setHover] = useState({backgroundColor: "#636363", color: "white"});
  const [focus, setFocus] = useState({backgroundColor: "rgba(255,255,255,0.7)", color: "#636363"});

  const [myChat, setMyChat] = useState("");
  const [chattingData, setChattingData] = useState(temp)

  const [switchValue, setSwitchValue] = useState(false);

  const [modalIsOpen, setIsOpen] = useState({
    inviteModal: false,
    settingModal: false,
  })

  const [changePassword, setChangePassword] = useState(false);

  const [settingType, setSettingType] = useState("프로필 설정");

  function openInviteModal() {
    setIsOpen({...modalIsOpen, inviteModal: true});
  }

  function openSettingModal() {
    setIsOpen({...modalIsOpen, settingModal: true});
  }

  function closeInviteModal() {
    setIsOpen({...modalIsOpen, inviteModal: false});
  }

  function closeSettingModal() {
    setIsOpen({...modalIsOpen, settingModal: false});
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

  let memberArray = [
    {id: 1, name: "내 닉네임(나)", status: "online", isChatting: false},
    {id: 2, name: "김씨1", status: "online", isChatting: false},
    {id: 3, name: "박씨2", status: "offline", isChatting: true},
    {id: 4, name: "박씨3", status: "online", isChatting: true},
    {id: 5, name: "박씨4", status: "offline", isChatting: false}
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
      const myChatMessage = {name: "나", content: myChat, time: "hh:mm", url: "url"}
      const newChattingData = chattingData.map(c => {
        if (c.id === currentChatIndex) {
          c.chatMessages.push(myChatMessage);
        }
        return c;
      })
      setChattingData(newChattingData);
      e.target.value = "";
    }
  }

  const renderSetting = (settingType) => {
    switch (settingType) {
      case "프로필 설정" :
        return (
          <>
            <div style={{fontSize: "12px", display: "flex", alignItems: "center", color: "#AEAEAE"}}>
              <img style={{width: "16px", height: "16px", marginRight: "5px"}} src={"/images/notice.png"}/>
              변경된 프로필은 당신의 다른 모든 공간에 동일하게 적용됩니다.
            </div>

            <div style={{display: "flex", justifyContent: "space-between", marginTop: "32px", alignItems: "center"}}>
              <div style={{display: "flex", color: "#1C1C1E"}}>
                닉네임
              </div>
              <div style={{position: "relative"}}>
                <input
                  style={{
                    border: "none",
                    width: "424px",
                    height: "30px",
                    backgroundColor: "#F0F0F0",
                    borderRadius: "4px",
                    padding: "4px 16px"
                  }}
                  placeholder={"내 현재 닉네임이 들어갑니다. "}
                />
                <div
                  style={{
                    position: "absolute",
                    right: "16px",
                    bottom: "10px",
                    fontSize: "12px",
                    color: "#5E1CAF",
                    textDecoration: "underline"
                  }}
                >
                  닉네임 변경
                </div>
              </div>

            </div>

            <div style={{marginTop: "30px", display: "flex", color: "#1C1C1E", height: "250px", marginBottom: "55px"}}>
              캐릭터 선택
              <div>
                {/* 게임 캐릭터 공간 */}
              </div>
            </div>

            <div style={{
              height: "36px",
              width: "100%",
              backgroundColor: "#5E1CAF",
              color: "white",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              fontSize: "14px",
              borderRadius: "8px"
            }}>
              변경사항 저장
            </div>
          </>
        )
      break;

      case "미디어 장비 설정" :
        return (
          <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
            <img
              style={{width: "305px", height: "198px"}}
              src={"/images/media_setting_profile.png"}/>

            <div style={{marginTop: "40px", width: "100%"}}>
              <div>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"}}>
                  <div style={{display: "flex", alignItems: "center"}}>
                    <img style={{width: "24px", height: "24px", marginRight: "4px"}} src={"/images/camOn/bold.png"}/>
                    카메라
                  </div>
                  <select style={{width: "424px", height: "30px", borderColor: "##5E1CAF"}} name="카메라 이름">
                    <option value="none">카메라1</option>
                    <option value="001">카메라2</option>
                    <option value="002">카메라3</option>
                  </select>
                </div>
              </div>
              <div>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"}}>
                  <div style={{display: "flex", alignItems: "center"}}>
                    <img style={{width: "24px", height: "24px", marginRight: "4px"}} src={"/images/micOn/bold.png"}/>
                    오디오
                  </div>
                  <select style={{width: "424px", height: "30px", borderColor: "##5E1CAF"}} name="오디오 이름">
                    <option value="none">오디오1</option>
                    <option value="001">오디오2</option>
                    <option value="002">오디오3</option>
                  </select>
                </div>
              </div>
              <div>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"}}>
                  <div style={{display: "flex", alignItems: "center"}}>
                    <img style={{width: "24px", height: "24px", marginRight: "4px"}} src={"/images/speaker/bold.png"}/>
                    스피커
                  </div>
                  <select style={{width: "424px", height: "30px", borderColor: "##5E1CAF"}} name="스피커 이름">
                    <option value="none">스피커1</option>
                    <option value="001">스피커2</option>
                    <option value="002">스피커3</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )
        break;

      case "개인 설정" :
        return (
          <div>
            <div style={{display: "flex", flexDirection: "column", fontSize: "14px"}}>
              <div style={{fontWeight: "bold"}}>
                로그인 정보
              </div>
              <div style={{display: "flex", marginTop: "10px"}}>
                <div style={{display: "flex", flexDirection: "column", marginRight: "16px"}}>
                  <div style={{fontSize: "12px", color: "#636363"}}>
                    이메일
                  </div>
                  <div style={{width: "276px", height: "36px", backgroundColor: "#F0F0F0", display: "flex", alignItems: "center", paddingLeft: "16px", borderRadius: "8px", marginTop: "4px"}}>
                    jksong0206@tenuto.co.kr
                  </div>
                </div>
                <div style={{display: "flex", flexDirection: "column"}}>
                  <div style={{fontSize: "12px", color: "#636363"}}>
                    연동계정
                  </div>
                  <div style={{width: "276px", height: "36px", backgroundColor: "#F0F0F0", display: "flex", alignItems: "center", paddingLeft: "16px", borderRadius: "8px", marginTop: "4px"}}>
                    <img style={{width: "24px", height: "24px"}} src={"/images/Google.png"}/>
                    구글 계정으로 로그인 됨
                  </div>
                </div>
              </div>
            </div>

            <div style={{borderBottom: "1px solid #F0F0F0", marginTop: "24px", marginBottom: "32px", width: "100%"}}/>

            <div>
              <div style={{fontSize: "14px", fontWeight: "bold", marginBottom :"4px"}}>
                로그아웃
              </div>
              <div style={{fontSize: "12px", color: "#636363", lineHeight: "17px", width: "455px"}}>
                로그아웃 시 현재 참여중인 공간들은 모두 계정에 저장되며, 동일한 계정으로 다시 로그인하면 저장된 공간들을 불러옵니다.
              </div>
            </div>

            <div style={{
              height: "36px",
              width: "100%",
              backgroundColor: "#5E1CAF",
              color: "white",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              fontSize: "14px",
              borderRadius: "8px",
              marginTop: "24px"
            }}>
              로그아웃
            </div>
          </div>
        )
        break;

      case "공간 설정" :
        return (
          <div>
            <div style={{display: "flex", justifyContent: "space-between", marginTop: "32px", alignItems: "center"}}>
              <div style={{display: "flex", color: "#1C1C1E"}}>
                공간 이름
              </div>
              <div style={{position: "relative"}}>
                <input
                  style={{
                    border: "none",
                    width: "424px",
                    height: "30px",
                    backgroundColor: "#F0F0F0",
                    borderRadius: "4px",
                    padding: "4px 16px"
                  }}
                  placeholder={"현재 공간의 이름"}
                />
                <div
                  style={{
                    position: "absolute",
                    right: "16px",
                    bottom: "10px",
                    fontSize: "12px",
                    color: "#5E1CAF",
                    textDecoration: "underline"
                  }}
                >
                  이름 변경
                </div>
              </div>
            </div>

            <div style={{display: "flex", justifyContent: "space-between", marginTop: "32px", alignItems: "center"}}>
              <div style={{display: "flex", color: "#1C1C1E"}}>
                초대 링크
              </div>
              <div style={{position: "relative"}}>
                <input
                  style={{
                    border: "none",
                    width: "424px",
                    height: "30px",
                    backgroundColor: "#F0F0F0",
                    borderRadius: "4px",
                    padding: "4px 16px"
                  }}
                  placeholder={"https://gather.town/app/3YhtaxRX52c6XjkQ/te... "}
                />
                <div
                  style={{
                    position: "absolute",
                    right: "16px",
                    bottom: "7px",
                    fontSize: "12px",
                    color: "#5E1CAF",
                    textDecoration: "underline",

                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center"
                    }}>
                    <img style={{width: "16px", height: "16px", marginRight: "4px"}} src={"/images/copy.png"}/>
                    복사
                  </div>
                </div>
              </div>
            </div>

            <div style={{borderBottom: "1px solid #F0F0F0", marginTop: "24px", marginBottom: "32px", width: "100%"}}/>

            <div>
              <div style={{fontSize: "14px", fontWeight: "bold", marginBottom :"4px"}}>
                방장 권한 위임
              </div>
              <div style={{fontSize: "12px", color: "#636363", lineHeight: "17px", width: "455px"}}>
                방장 권한을 다른사람에게 위임한 후 기존에 지닌 방장 권한은 사라지고 일반 멤버로 변경됩니다.
                아래 인원들 중 한사람을 선택하여 다음 방장으로 지정할 수 있습니다.
              </div>
            </div>

            <div style={{height: "150px"}}>
              <div
                style={{width: "276px", height: "54px", backgroundColor: "#F0F0F0", borderRadius: "15px", padding: "11px, 16px", display: "flex", alignItems: "center", marginTop: "28px"}}
              >
                <div style={{display: "flex", justifyContent: "space-between", width: "100%", padding: "0 16px 0 16px"}}>
                  <div style={{display: "flex", alignItems: "center"}}>
                    <img style={{width: "32px", height: "32px", marginRight: "6px"}} src={"/images/profile_image.png"}/>
                    <div style={{display: "flex", flexDirection: "column"}}>
                      <div style={{color: "1C1C1E", fontSize: "14px"}}>
                        다른 사람 닉네임
                      </div>
                      <div style={{fontSize: "12px", color: "#636363"}}>
                        jksong0206@gmail.com
                      </div>
                    </div>
                  </div>
                  <img style={{width: "24px", height: "24px"}}src={"/images/radioDefault.png"}/>
                </div>
              </div>
            </div>

            <div style={{
              height: "36px",
              width: "100%",
              backgroundColor: "#5E1CAF",
              color: "white",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              fontSize: "14px",
              borderRadius: "8px"
            }}>
              변경사항 저장
            </div>

          </div>
        )
        break;
      case "보안 설정" :
        return (
          <div>
            <div
              style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
            >
              <div>
                <div style={{fontSize: "14px", fontWeight: "bold", marginBottom: "4px"}}>
                  비밀정보 설정
                </div>
                <div style={{fontSize: "12px", color: "#636363", lineHeight: "17px", width: "455px"}}>
                  비밀번호 설정 시 비밀번호를 입력한 사용자들만 공간에 참여할 수 있습니다.
                  설정하지 않으면 누구나 링크만 있으면 공간에 참여할 수 있습니다.
                </div>
              </div>
              <Switch
                isOn={switchValue}
                handleToggle={() => setSwitchValue(!switchValue)}
              />


            </div>

            {switchValue &&
            <div style={{display: "flex", justifyContent: "space-between", marginTop: "32px", alignItems: "center", fontSize: "14px"}}>
              <div style={{display: "flex", color: "#1C1C1E"}}>
                {changePassword ? "새로운 비밀번호" : "현재 비밀번호"}
              </div>
              <div style={{position: "relative"}}>
                <input
                  style={{
                    border: "none",
                    width: "424px",
                    height: "30px",
                    backgroundColor: "#F0F0F0",
                    borderRadius: "4px",
                    padding: "4px 16px",
                    color: "#AEAEAE",
                  }}
                  placeholder={changePassword ? "새로운 비밀번호를 입력하세요" : "기존 비밀번호 혹은 설정된 비밀번호 없음"}
                />
                <div
                  style={{
                    display: "flex",
                    position: "absolute",
                    right: "16px",
                    bottom: "10px",
                    fontSize: "12px",
                  }}
                >
                  {
                    changePassword &&
                      <div
                        onClick={() => setChangePassword(false)}
                        style={{
                          color: "#8E8E8E",
                          marginRight: "12px"
                        }}
                      >
                        취소
                      </div>
                  }
                  <div
                    onClick={() => setChangePassword(true)}
                    style={{
                      color: "#5E1CAF",
                      textDecoration: "underline"
                    }}
                  >
                    {changePassword ? "변경" : "비밀번호 변경"}
                  </div>
                </div>
              </div>
            </div>
            }

            <div style={{borderBottom: "1px solid #F0F0F0", marginTop: "24px", marginBottom: "32px", width: "100%"}}/>

            <div>
              <div style={{fontSize: "14px", fontWeight: "bold", marginBottom: "4px"}}>
                공간 해산
              </div>
              <div style={{fontSize: "12px", color: "#636363", lineHeight: "17px", width: "455px"}}>
                이 기능을 사용하면 이 공간에 참여한 모든 사람들을 내보내며 공간의 모든 데이터들이 삭제되고 다시는 참여할 수 없습니다.
              </div>
            </div>

            <div style={{
              height: "36px",
              width: "100%",
              backgroundColor: "#FF2C2C",
              color: "white",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              fontSize: "14px",
              borderRadius: "8px",
              marginTop: "24px"
            }}>
              공간 해산
            </div>

          </div>
        )
        break;
      default:
        return (
          <div>프로필 설정</div>
        )
        break;
    }
  }

  return (
    <div style={{position: "relative"}} className="game-container">
      {linkContainer}
      <div style={{position:"absolute", top: "40px", right: "40px", width: "224px", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
        <div
          style={{maxHeight: !showMember ? "55px" : "377px", borderRadius: "19px", backgroundColor: "rgba(0,0,0,0.8)", color: "#DDDDDD", fontSize: "14px", display: "flex", flexDirection: "column", marginBottom: "12px"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 20px", }}>
            <div style={{display: "flex", alignItems: "center"}}>
              <img style={{width: "24px", height: "24px", marginRight: "6px"}} src={"/images/users/bold.png"}/>
              참여 멤버 {memberArray.length}
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
            <div style={{display: "flex", flexDirection: "column", overflow: "scroll", fontSize: "16px", color: "#CCCCCC"}}>

              {memberArray.map((item) => {
                return (
                  <div
                    onClick={() => {
                      setShowChatting(true);
                      setCurrentChatId(chattingData.findIndex(c => c.id === item.id))
                    }}
                    key={item.id}
                    style={{display: "flex", padding: "8px 20px", opacity: currentChatIndex === item.id && 0.8, backgroundColor: currentChatIndex === item.id && "black"}}>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                      <div style={{display: "flex"}}>
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
                      {item.isChatting &&
                      <div style={{width: "6px", height: "6px", backgroundColor: "#FF2C2C", borderRadius: "50%"}} />
                      }
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
                setCurrentChatId(0)
              }}
              style={{width: "184px", minHeight: "33px", backgroundColor: hover.backgroundColor, color: hover.color, display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "8px", margin: "15px 20px"}}>
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
                      <img style={{width: "28px", height: "28px", marginRight: "6px"}} src={"/images/chatting/bold.png"} />
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

                {chattingData[currentChatIndex].chatMessages.reduce((acc, cur, idx) => {
                  if (idx === 0) {
                    acc = [{
                      name: cur.name,
                      contents: [cur.content],
                      time: cur.time,
                      url: cur.url
                    }]
                  }

                  let prev = acc[acc.length-1];

                  if (prev.name === cur.name && prev.time === cur.time) {
                    prev.contents.push(cur.content)

                  } else {
                    let temp = {
                      name: cur.name,
                      contents: [cur.content],
                      time: cur.time,
                      url: cur.url,
                    }
                    acc = [...acc, temp]
                  }

                  return acc;

                }, []).map((chatMessage) => {

                  return (
                    <div style={{
                      padding: "16px",
                      display: "flex",
                      justifyContent: currentChatIndex === 1 ? "flex-start" :  chatMessage.name !== "나" ? "flex-start" : "flex-end",
                    }}>
                      <div style={{display: "flex"}}>

                        <div style={{display: "flex", flexDirection: "column", fontSize: "14px", width: "100%"}}>
                          <div style={{
                            display: "flex",
                            marginBottom: "6px",
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

                          {chatMessage.contents.map((content) => {
                            return (
                              <div style={{display: "flex", justifyContent: currentChatIndex === 1 ? "flex-start" :  chatMessage.name !== "나" ? "flex-start" : "flex-end", lineHeight: "20px"}}>
                                {content}
                              </div>
                            )
                          })
                          }

                        </div>
                      </div>
                    </div>
                  )
                })}

              </div>

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
            <div
              onClick={openSettingModal}
              style={{lineHeight: "15px"}}>
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
          onClick={openInviteModal}
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
      {modalIsOpen.inviteModal ?
        <div>
          <Modal
            isOpen={modalIsOpen.inviteModal}
            onRequestClose={closeInviteModal}
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

      {/*settingModal*/}
      {modalIsOpen.settingModal ?
        <div>
          <Modal
            isOpen={modalIsOpen.settingModal}
            onRequestClose={closeSettingModal}
            style={{
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                width: "840px",
                height: "584px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                // flexDirection: "column",
                backgroundColor: "#5E1CAF",
                padding: "0"
              }}
            }
            contentLabel="Example Modal"
          >
            <div
              style={{width: "192px", height: "100%", left: 0, display: "flex", flexDirection: "column", color: "white", fontSize: "14px", justifyContent: "space-between", padding: "30px 20px"}}
            >
              {/* TODO 나중에 깔끔하게 만들기 */}
              <div>
                <div style={{opacity: 0.6, marginBottom: "11px"}}>jksong0206@tenuto.co.kr</div>
                <div onClick={(e) => setSettingType(e.currentTarget.innerText)} name="프로필 설정" style={{marginBottom: "8px"}}>프로필 설정</div>
                <div onClick={(e) => setSettingType(e.currentTarget.innerText)} name="미디어 장비 설정" style={{marginBottom: "8px"}}>미디어 장비 설정</div>
                <div onClick={(e) => setSettingType(e.currentTarget.innerText)} name="개인 설정" style={{marginBottom: "30px"}}>개인 설정</div>
                <div style={{opacity: 0.6, marginBottom: "11px"}}>공간의 이름(admin)</div>
                <div onClick={(e) => setSettingType(e.currentTarget.innerText)} name="공간 설정" style={{marginBottom: "8px"}}>공간 설정</div>
                <div onClick={(e) => setSettingType(e.currentTarget.innerText)} name="보안 설정">보안 설정</div>
              </div>

              <div
                onClick={closeSettingModal}
                style={{width: "156px", border: "1px solid white", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "8px", height: "36px"}}>
                이 공간에서 나가기
                <img style={{width: "16px", height: "16px", marginLeft: "5px"}} src={"/images/exit.png"}/>
              </div>
            </div>

            <div
              style={{width: "100%", height: "100%", backgroundColor: "white", padding: "40px"}}
            >
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid #F0F0F0", marginBottom: "24px"}}>
                <div style={{fontSize: "20px", fontWeight :"20px"}}>{settingType}</div>
                <img
                  onClick={closeSettingModal}
                  style={{width: "24px", height: "24px"}}src={"/images/close.png"}/>
              </div>

              {/* 프로필 세팅 */}
              <div style={{display: "flex", flexDirection: "column"}}>
                {
                  renderSetting(settingType)
                }
              </div>

            </div>

          </Modal>
        </div>
        : <></>}
    </div>
  );
}


