import Modal from "react-modal";
import React, {useState, useRef} from "react";
import GameChangeCharacter from "./GameChangeCharacter";
import Switch from "./Switch";
import Popup from "./Popup.jsx";

import {
  notice,
  mediaSettingImage,
  camera,
  audio,
  speaker,
  googleIcon,
  copy,
  profileIconXL,
  exitIconB,
  exitIconW,
  closeButtonB,
  checkButton,
  unCheckButton,
} from "../resources/images";

// 공간설정
const sampleArr = [
  {id: 1, name: "다른 사람 닉네임1", email: "jksong0106@gmail.com"},
  {id: 2, name: "다른 사람 닉네임2", email: "jksong0206@gmail.com"},
  {id: 3, name: "다른 사람 닉네임3", email: "jksong0306@gmail.com"},
  {id: 4, name: "다른 사람 닉네임4", email: "jksong0406@gmail.com"},
  {id: 5, name: "다른 사람 닉네임5", email: "jksong0506@gmail.com"},
  {id: 6, name: "다른 사람 닉네임6", email: "jksong0606@gmail.com"},
]

const sampleData = {
  nickname: "빙구",
  roomname: "테누토",
  password: "q1w2e3r4!",
  inviteLink: "https://gather.town/app/3YhtaxRX52c6XjkQ/te...",
}

const setIndexArr = [
  {id: 1, name: "프로필 설정"},
  {id: 2, name: "미디어 설정"},
  {id: 3, name: "개인 설정"},
  {id: 4, name: "공간 설정"},
  {id: 5, name: "보안 설정"},
]

export default function SettingModal({modalIsOpen, closeModal, settingIndex, setSettingIndex}) {
  const [settingType, setSettingType] = useState("프로필 설정");
  const [switchValue, setSwitchValue] = useState(false);
  const [hover, setHover] = useState(false);

  const [showTwoBtnPopup, setTwoBtnPopup] = useState(false);
  const [showOneBtnPopup, setOneBtnPopup] = useState(false);

  const [adminIndex, setAdminIndex] = useState(1);

  const inputRef = useRef();

  const [messages, setMessages] = useState({
    one: undefined,
    two: undefined,
  });

  const [events, setEvents] = useState({
    one: () => {console.log('one button alert triggered')},
    two: () => {console.log('two button alert triggered')},
  });

  const [inputs, setInputs] = useState({
    nickname: sampleData.nickname,
    roomname: sampleData.roomname,
    password: sampleData.password,
  })

  const {nickname, roomname, password} = inputs;

  const [inputChanges, setInputChanges] = useState({
    nicknameChange: false,
    roomnameChange: false,
    passwordChange: false,
  });

  const {nicknameChange, roomnameChange, passwordChange} = inputChanges;

  const onChange = (e) => {
    const {name, value} = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    })
  }

  // 게임 캐릭터 설정
  const [characterId, setCharacterId] = useState(211);
  let currentMap = 301;

  console.log('characterId ~~~', characterId);

  const renderSetting = (settingIndex) => {
    switch (settingIndex) {
      case 1 :
        return (
          <>
            <div style={{fontSize: "12px", display: "flex", alignItems: "center", color: "#AEAEAE"}}>
              <div style={{marginRight: "5px"}}>
                {notice}
              </div>
              변경된 프로필은 당신의 다른 모든 공간에 동일하게 적용됩니다.
            </div>
            <div style={{display: "flex", marginTop: "32px", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
              <div style={{display: "flex", color: "#1C1C1E", width: "50px"}}>
                닉네임
              </div>
              <div style={{position: "relative", marginRight: "8px"}}>
                <input
                  ref={inputRef}
                  name="nickname"
                  onChange={onChange}
                  value={nickname}
                  disabled={!nicknameChange}
                  style={{
                    border: nicknameChange ? "1px solid #5E1CAF" : "none",
                    outline: "none",
                    width: "448px",
                    height: "30px",
                    backgroundColor: nicknameChange ? "white" : "#F0F0F0",
                    borderRadius: "4px",
                    padding: "4px 16px",
                    color: nicknameChange ? "#1C1C1E" : "#AEAEAE",
                  }}
                  placeholder={"내 현재 닉네임이 들어갑니다. "}
                />
                <div
                  onClick={() => {
                    setInputChanges({...inputChanges, nicknameChange: !nicknameChange})
                    inputRef.current.focus();
                  }}
                  style={{
                    position: "absolute",
                    right: "16px",
                    bottom: "10px",
                    fontSize: "12px",
                    color: "#5E1CAF",
                    textDecoration:  "underline"
                  }}
                >
                  {nicknameChange ? "저장" : "닉네임 변경"}
                </div>
              </div>

            </div>

            <div style={{marginTop: "30px", display: "flex", color: "#1C1C1E", height: "250px", marginBottom: "55px", }}>
              <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                <div style={{marginTop: "10px", width: "80px"}}>
                  캐릭터 선택
                </div>
                <div style={{overflow: "scroll"}}>
                  {/* 게임 캐릭터 공간 */}
                  <GameChangeCharacter
                    setCharacterId={setCharacterId}
                    characterId={characterId}
                    currentMap={currentMap}
                  />
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                setMessages({one: "변경 되었습니다"});
                setOneBtnPopup(true);
                setEvents({...events, one: () => {
                  console.log("changes saved - nickname: ", nickname, "characterId: ", characterId)
                }})
              }}
              style={{
                height: "36px",
                width: "568px",
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

      case 2 :
        return (
          <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
            {mediaSettingImage}
            <div style={{marginTop: "40px", width: "100%"}}>
              <div>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"}}>
                  <div style={{display: "flex", alignItems: "center"}}>
                    <div style={{marginRight: "5px"}}>
                      {camera}
                    </div>
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
                    <div style={{marginRight: "4px"}}>
                      {audio}
                    </div>
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

                    <div style={{marginRight: "4px"}}>
                      {speaker}
                    </div>
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

      case 3 :
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
                  <div style={{width: "276px", height: "36px", backgroundColor: "#F0F0F0", display: "flex", alignItems: "center", paddingLeft: "16px", borderRadius: "8px", marginTop: "4px", color: "#1C1C1E"}}>
                    jksong0206@tenuto.co.kr
                  </div>
                </div>
                <div style={{display: "flex", flexDirection: "column", fontWeight: "normal"}}>
                  <div style={{fontSize: "12px", color: "#636363"}}>
                    연동계정
                  </div>
                  <div style={{width: "276px", height: "36px", backgroundColor: "#F0F0F0", display: "flex", alignItems: "center", paddingLeft: "16px", borderRadius: "8px", marginTop: "4px", color: "#1C1C1E"}}>
                    {googleIcon}
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
            <div
              onClick={() => {
                setMessages({two: "정말로 [jksong0206@tenuto.co.kr]계정에서 로그아웃 하시겠습니까?", one: "로그아웃이 완료되었습니다"});
                setTwoBtnPopup(true);
                setEvents({...events, one: () => console.log("logout completed")})
              }}
              style={{
                height: "36px",
                width: "100%",
                backgroundColor: "#FF9330",
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

      case 4 :
        return (
          <div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <div style={{display: "flex", color: "#1C1C1E"}}>
                공간 이름
              </div>
              <div style={{position: "relative"}}>
                <input
                  ref={inputRef}
                  name="roomname"
                  onChange={onChange}
                  value={roomname}
                  disabled={!roomnameChange}
                  style={{
                    border: roomnameChange ? "1px solid #5E1CAF" : "none",
                    outline: "none",
                    width: "424px",
                    height: "30px",
                    backgroundColor: roomnameChange ? "white" : "#F0F0F0",
                    borderRadius: "4px",
                    padding: "4px 16px",
                    color: roomnameChange ? "#1C1C1E" : "#AEAEAE",
                  }}
                  placeholder={"현재 공간의 이름"}
                />
                <div
                  onClick={() => {
                    setInputChanges({...inputChanges, roomnameChange: !roomnameChange})
                    inputRef.current.focus();
                  }}
                  style={{
                    position: "absolute",
                    right: "16px",
                    bottom: "10px",
                    fontSize: "12px",
                    color: "#5E1CAF",
                    textDecoration: "underline"
                  }}
                >
                  {roomnameChange ? "저장" : "이름 변경"}
                </div>
              </div>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", marginTop: "32px", alignItems: "center"}}>
              <div style={{display: "flex", color: "#1C1C1E"}}>
                초대 링크
              </div>
              <div style={{position: "relative"}}>
                <input
                  disabled={true}
                  value={sampleData.inviteLink}
                  style={{
                    border: "none",
                    width: "424px",
                    height: "30px",
                    backgroundColor: "#F0F0F0",
                    borderRadius: "4px",
                    padding: "4px 16px",
                    color: "#AEAEAE",
                  }}
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
                    onClick={() => {
                      setMessages({one: "클립보드에 복사되었습니다."});
                      setOneBtnPopup(true);
                      setEvents({...events, one: () => console.log("copy completed")})
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center"
                    }}>
                    <div style={{marginRight: "4px"}}>
                      {copy}
                    </div>
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
            <div style={{display: "flex", flexWrap: "wrap", height: "177px", overflow: "scroll", paddingBottom: "28px"}}>
              {sampleArr.map((item) => {
                return (
                  <div
                    key={item.id}
                    onClick={() => setAdminIndex(item.id)}
                    style={{width: "276px", height: "54px", backgroundColor: "#F0F0F0", borderRadius: "15px", padding: "11px, 16px", display: "flex", alignItems: "center", marginTop: "28px", marginRight: "7px"}}
                  >
                    <div style={{display: "flex", justifyContent: "space-between", width: "100%", padding: "0 16px 0 16px", alignItems: "center"}}>
                      <div style={{display: "flex", alignItems: "center"}}>
                        <div style={{marginRight: "6px"}}>
                          {profileIconXL}
                        </div>
                        <div style={{display: "flex", flexDirection: "column"}}>
                          <div style={{color: "1C1C1E", fontSize: "14px"}}>
                            {item.name}
                          </div>
                          <div style={{fontSize: "12px", color: "#636363"}}>
                            {item.email}
                          </div>
                        </div>
                      </div>
                      <div children={adminIndex === item.id ? checkButton : unCheckButton}/>
                    </div>
                  </div>
                )
              })}
            </div>
            <div
              onClick={() => {
                setMessages({one: "변경 되었습니다"});
                setOneBtnPopup(true);
                setEvents({...events, one: () => console.log("changes saved - roomname: ", roomname, "copyLink", sampleData.inviteLink, "newAdmin", sampleArr[adminIndex-1].name)})
              }}
              style={{
                height: "36px",
                width: "100%",
                backgroundColor: "#5E1CAF",
                color: "white",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                fontSize: "14px",
                borderRadius: "8px",
                marginTop: "35px",
              }}>
              변경사항 저장
            </div>
          </div>
        )
        break;
      case 5 :
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
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "32px",
                alignItems: "center",
                fontSize: "14px"
              }}>
                <div style={{display: "flex", color: "#1C1C1E"}}>
                  {passwordChange ? "새로운 비밀번호" : "현재 비밀번호"}
                </div>
                <div style={{position: "relative"}}>
                  <input
                    ref={inputRef}
                    name="password"
                    onChange={onChange}
                    value={password}
                    disabled={!passwordChange}
                    style={{
                      border: passwordChange ? "1px solid #5E1CAF" : "none",
                      width: "424px",
                      height: "30px",
                      backgroundColor: passwordChange ? "white" : "#F0F0F0",
                      borderRadius: "4px",
                      padding: "4px 16px",
                      color: passwordChange ? "#1C1C1E" : "#AEAEAE",
                    }}
                    placeholder={passwordChange ? "새로운 비밀번호를 입력하세요" : "기존 비밀번호 혹은 설정된 비밀번호 없음"}
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
                    <div
                      onClick={() => {
                        if (passwordChange === true) {
                          console.log('저장되었습니다!')
                        }
                        setInputChanges({...inputChanges, passwordChange: !passwordChange})
                      }}
                      style={{
                        color: "#5E1CAF",
                        textDecoration: "underline",
                      }}
                    >
                      {passwordChange ? "저장" : "비밀번호 변경"}
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
            <div
              onClick={() => {
                setMessages({one: "정말로 해산하시겠습니까?"});
                setOneBtnPopup(true);
                setEvents({...events, one: () => {console.log("discard room")}})
              }}
              style={{
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
    }
  }

  return (
    <div>
      <Modal
        isOpen={modalIsOpen.setting}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.6)",
          },
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
            backgroundColor: "#5E1CAF",
            padding: "0",
            border: "none"
          }}
        }
        contentLabel="Example Modal"
      >
        <div
          style={{width: "192px", height: "100%", left: 0, display: "flex", flexDirection: "column", color: "white", fontSize: "14px", justifyContent: "space-between", padding: "30px 0"}}
        >
          <div style={{width: "192px"}}>
            {/* TODO 나중에 깔끔하게 만들기 */}
            <div>
              <div style={{opacity: 0.6, marginBottom: "11px", padding: "0 20px"}}>jksong0206@tenuto.co.kr</div>
              <div onClick={() => setSettingIndex(1)} style={{display: "flex", alignItems: "center", padding: "0 20px", width: "192px", height: "28px", backgroundColor: settingIndex === 1 ? "#501C90" : "#5E1CAF", marginBottom: "8px"}}>프로필 설정</div>
              <div onClick={() => setSettingIndex(2)} style={{display: "flex", alignItems: "center", padding: "0 20px", width: "192px", height: "28px", backgroundColor: settingIndex === 2 ? "#501C90" : "#5E1CAF", marginBottom: "8px"}}>미디어 장비 설정</div>
              <div onClick={() => setSettingIndex(3)} style={{display: "flex", alignItems: "center", padding: "0 20px", width: "192px", height: "28px", backgroundColor: settingIndex === 3 ? "#501C90" : "#5E1CAF", marginBottom: "8px"}}>개인 설정</div>

              {/* admin 일때만 보이는 메뉴 */}
              <div style={{opacity: 0.6, marginBottom: "11px", padding: "0 20px", marginTop: "30px"}}>공간의 이름(admin)</div>
              <div onClick={() => setSettingIndex(4)} style={{display: "flex", alignItems: "center", padding: "0 20px", width: "192px", height: "28px", backgroundColor: settingIndex === 4 ? "#501C90" : "#5E1CAF", marginBottom: "8px"}}>공간 설정(admin)</div>
              <div onClick={() => setSettingIndex(5)} style={{display: "flex", alignItems: "center", padding: "0 20px", width: "192px", height: "28px", backgroundColor: settingIndex === 5 ? "#501C90" : "#5E1CAF", marginBottom: "8px"}}>보안 설정(admin)</div>
            </div>
            <div style={{padding: "0 18px"}}>
              <div
                onClick={() => {
                  setMessages({two: "정말로 [공간의 이름]에서 나가시겠습니까?", one: "완료되었습니다"});
                  setTwoBtnPopup(true);
                  setEvents({...events, one: () => closeModal()})
                }}
                onMouseOut={() => setHover(false)}
                onMouseOver={() => setHover(true)}
                style={{
                  width: "156px",
                  border: "1px solid white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "8px",
                  height: "36px",
                  backgroundColor: hover ? "white" : "#5E1CAF",
                  color: hover ? "#3A3A3C" : "white",
                  position: "absolute",
                  bottom: "30px",
                }}>
                이 공간에서 나가기
                <div style={{marginRight: "5px", display: "flex", alignItems: "center"}} children={hover ? exitIconB : exitIconW} />
              </div>
            </div>
          </div>
        </div>
        <div
          style={{width: "100%", height: "100%", backgroundColor: "white", overflow: "hidden", padding: "40px"}}
        >
          <div style={{display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid #F0F0F0", marginBottom: "24px"}}>
              <div style={{fontSize: "20px", fontWeight :"20px"}}>{
                setIndexArr.map((item) => {
                  if (item.id === settingIndex) {
                    return (
                      <div>
                        {item.name}
                      </div>
                    )
                  }
                })
              }</div>
              <div onClick={closeModal}>
                {closeButtonB}
              </div>
            </div>
            {
              renderSetting(settingIndex)
            }
          </div>
        </div>
      </Modal>

      <Popup
        messages={messages}
        showTwoBtnPopup={showTwoBtnPopup}
        setTwoBtnPopup={setTwoBtnPopup}
        setOneBtnPopup={setOneBtnPopup}
        showOneBtnPopup={showOneBtnPopup}
        events={events}
      />

    </div>
  )
}
