import React, {useState} from "react";
import {memberIcon, arrowUp, arrowDown, groupChatting, profileIconM, closeButtonG, profileIconS, profileIconXL} from "../resources/images";

let memberArray = [
  {id: 1, name: "내 닉네임(나)", status: "online", isChatting: false},
  {id: 2, name: "김씨1", status: "online", isChatting: false},
  {id: 3, name: "박씨2", status: "offline", isChatting: true},
  {id: 4, name: "박씨3", status: "online", isChatting: true},
  {id: 5, name: "박씨4", status: "offline", isChatting: false}
]

let temp = [
  {
    id: 0,
    name: "오픈카톡방",
    type: "GROUP",
    chatMessages: [
      {name: "KIM", content: "내 이름은 킴이야", time: "hh:mm", url: "url"},
      {name: "나", content: "내가 친 채팅", time: "hh:mm", url: "url"},
      {name: "PARK2", content: "내 이름은 박2이야", time: "hh:mm", url: "url"},
      {name: "PARK3", content: "내 이름은 박3이야", time: "hh:mm", url: "url"},
      {name: "PARK4", content: "내 이름은 박4이야", time: "hh:mm", url: "url"},
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
      {name: "PARK2", content: "내 이름은 박2이야", time: "hh:mm", url: "url"},
      {name: "PARK2", content: "내 이름은 박2이야", time: "hh:mm", url: "url"},
      {name: "PARK2", content: "내 이름은 박2이야", time: "hh:mm+1", url: "url"},
      {name: "PARK2", content: "내 이름은 박2이야", time: "hh:mm+2", url: "url"},
    ]
  },
  {
    id:4,
    name: "박씨3",
    type: "PRIVATE",
    chatMessages: [
      {name: "PARK3", content: "내 이름은 박3이야", time: "hh:mm", url: "url"},
      {name: "PARK3", content: "내 이름은 박3이야", time: "hh:mm", url: "url"},
      {name: "PARK3", content: "내 이름은 박3이야", time: "hh:mm", url: "url"},
    ]
  },
  {
    id:5,
    name: "박씨4",
    type: "PRIVATE",
    chatMessages: [
      {name: "PARK4", content: "내 이름은 박4이야", time: "hh:mm", url: "url"},
      {name: "PARK4", content: "내 이름은 박4이야", time: "hh:mm", url: "url"},
      {name: "PARK4", content: "내 이름은 박4이야", time: "hh:mm", url: "url"}
    ]
  }
]

export default function Chatting({}) {
  const [myChat, setMyChat] = useState("");
  const [chattingData, setChattingData] = useState(temp)
  const [showMember, setShowMember] = useState(false);
  const [showChatting, setShowChatting] = useState(false);
  const [currentChatIndex, setCurrentChatId] = useState(undefined);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState({backgroundColor: "rgba(255,255,255,0.7)", color: "#636363"});

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

  return (
    <div style={{
      position: "absolute",
      top: "40px",
      right: "40px",
      width: "224px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      <div
        style={{
          maxHeight: !showMember ? "55px" : "377px",
          borderRadius: "19px",
          backgroundColor: "rgba(0,0,0,0.8)",
          color: "#DDDDDD",
          fontSize: "14px",
          display: "flex",
          flexDirection: "column",
          marginBottom: "12px"
        }}>
        <div
          onClick={() => setShowMember(!showMember)}
          style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 20px"}}>
          <div style={{display: "flex", alignItems: "center"}}>
            <div style={{marginRight: "6px"}}>
              {memberIcon}
            </div>
            참여 멤버 {memberArray.length}
          </div>

          {/*TODO: 이렇게 쓰자*/}
          <div children={showMember ? arrowUp : arrowDown} />
        </div>

        {showMember &&
        <>
          <div
            style={{display: "flex", flexDirection: "column", overflow: "scroll", fontSize: "16px", color: "#CCCCCC"}}>

            {memberArray.map((item) => {
              return (
                <div
                  onClick={() => {
                    setShowChatting(true);
                    setCurrentChatId(chattingData.findIndex(c => c.id === item.id))
                  }}
                  key={item.id}
                  style={{
                    display: "flex",
                    padding: "8px 20px",
                    opacity: currentChatIndex === item.id && 0.8,
                    backgroundColor: currentChatIndex === item.id && "black"
                  }}>
                  <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                    <div style={{display: "flex"}}>
                      <div style={{position: "relative"}}>
                        {profileIconXL}
                        <div style={{
                          width: "12px",
                          height: "12px",
                          backgroundColor: item.status === "online" ? "#00FF47" : "#FF6B00",
                          borderRadius: "50%",
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          border: "2px solid white"
                        }}>
                        </div>
                      </div>
                      <div
                        style={{display: "flex", flexDirection: "column", marginLeft: "8px", justifyContent: "center"}}>
                        <div style={{
                          fontSize: "16px",
                          width: "100%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>
                          {item.name}
                        </div>
                      </div>
                    </div>
                    {item.isChatting &&
                    <div style={{width: "6px", height: "6px", backgroundColor: "#FF2C2C", borderRadius: "50%"}}/>
                    }
                  </div>
                </div>
              )
            })}

          </div>
          <div
            onMouseOut={() => setHover(false)}
            onMouseOver={() => setHover(true)}
            onClick={() => {
              setShowChatting(true);
              setCurrentChatId(0)
            }}
            style={{
              width: "184px",
              minHeight: "33px",
              backgroundColor: hover ? "white" : "#636363",
              color: hover ? "#636363" : "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "8px",
              margin: "15px 20px"
            }}>
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
                    <div style={{marginRight: "6px"}}>
                      {groupChatting}
                    </div>
                    그룹 채팅
                  </div> :
                  chattingData[currentChatIndex].type === "PRIVATE" ?
                    <>
                      <div style={{position: "relative", marginRight: "8px"}}>
                        {profileIconM}
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
                {closeButtonG}
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

                let prev = acc[acc.length - 1];

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
                    justifyContent: currentChatIndex === 1 ? "flex-start" : chatMessage.name !== "나" ? "flex-start" : "flex-end",
                  }}>
                    <div style={{display: "flex"}}>
                      <div style={{display: "flex", flexDirection: "column", fontSize: "14px", width: "100%"}}>
                        <div style={{
                          display: "flex",
                          marginBottom: "6px",
                          alignItems: "center"
                        }}>
                          <div style={{marginRight: "4px"}}>
                            {profileIconS}
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
                            <div style={{
                              display: "flex",
                              justifyContent: currentChatIndex === 1 ? "flex-start" : chatMessage.name !== "나" ? "flex-start" : "flex-end",
                              lineHeight: "20px"
                            }}>
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
  )
}
