import React, {useEffect, useState} from 'react';
import "./Dashboard.css";
import {leftArrow} from "../resources/images";
import Switch from "./Switch";
import {useHistory} from "react-router-dom";
import {makeId} from "../utils";
import {useDispatch} from "react-redux";
import api from "../api/api";
import {setRoomId} from "../redux/features/common/commonSlice";

export default function CreateSpace() {
  const [isMenu, setIsMenu] = useState(false);
  const [menuTitle, setMenuTitle] = useState(undefined);
  const [switchValue, setSwitchValue] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [presetId, setPresetId] = useState(undefined);
  const [roomList, setRoomList] = useState([]);

  const [inputs, setInputs] = useState({
    roomname: undefined,
    password: undefined,
    purposeId: undefined,
  })

  let [randomId, _] = useState(makeId(16));
  const {roomname, password, purposeId} = inputs;
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    api.roomPreset().then(res => setRoomList(res.roomPresetList));
  }, [])

  const goToHome = () => {
    history.push({pathname: "/dashboard"})
  }

  const onChange = (e) => {
    const {name, value} = e.target;
    if (e.target.name === "password" && e.target.value.length > 0) {
      setHasPassword(true);
    } else {
      setHasPassword(false);
    }

    setInputs({
      ...inputs,
      [name]: value,
    })
  }

  const createNewRoom = () => {
    api.createRoom(roomname, password, presetId, hasPassword, password).then(res => {
      dispatch(setRoomId(res.roomId));
      history.push({pathname: `/room/${res.roomUrl}`});
    })
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: isMenu ? "space-between" : "center",
      flexDirection: isMenu ? null : "column",
      backgroundColor: "white",
    }}>
      <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
        <div>
          <div style={{width: "1000px", marginTop: "80px"}}>
            <div
              onClick={goToHome}
              style={{display: "flex", justifyContent: "flex-start", alignItems: "center"}}>
              {leftArrow}
              <div style={{color: "#AEAEAE", fontSize: "16px", marginLeft: "8px"}}>????????? ????????????</div>
            </div>

            <div style={{marginTop: "24px"}}>
              <div style={{fontSize: "24px", fontWeight: "bold", color: "#1C1C1E"}}>
                ???????????? ????????? ??????????????????!
              </div>
              <div style={{fontSize: "14px", color: "#636363", marginTop: "4px", lineHeight: "23px", marginBottom: "100px"}}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                into
                electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
                release
                of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software
                like Aldus PageMaker including versions of Lorem Ipsum.
              </div>
            </div>
          </div>
          <div style={{height: "800px", overflow: "scroll"}}>
            {roomList.map((roomCategory) => {
              return (
                <div key={roomCategory.categoryId}>
                  <Space roomCategory={roomCategory} setIsMenu={setIsMenu} setMenuTitle={setMenuTitle}
                         setPresetId={setPresetId}/>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {isMenu &&
        <div style={{width: "410px", height: "100vh", backgroundColor: "#47335F", padding: "0px 24px"}}>
          <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%"}}>
            <div>
              <div style={{marginTop: "80px"}}>
                <div style={{display: "flex", alignItems: "flex-end"}}>
                  <div
                    style={{fontSize: "28px", color: "white", fontWeight: "bold", marginRight: "4px"}}>{menuTitle}</div>
                  <span style={{fontSize: "14px", color: "white", opacity: 0.8}}>?????????</span>
                </div>
                <div style={{marginTop: "22px", color: "white", opacity: 0.8, fontSize: "14px"}}>Amet minim mollit non
                  deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
                  Exercitation veniam consequat sunt nostrud amet.
                </div>
              </div>

              <div style={{borderTop: "1px solid white", margin: "40px 0"}}/>
              <div style={{color: "white"}}>
                <div>
                  <div style={{fontSize: "16px", alignItems: "flex-start", display: "flex"}}>
                    ?????? ??????
                    <div style={{fontSize: "16px"}}>*</div>
                  </div>
                  <input
                    name="roomname"
                    onChange={onChange}
                    style={{
                      width: "362px",
                      height: "34px",
                      borderRadius: "4px",
                      border: "1px solid #C7C7C7",
                      outline: "none",
                      padding: "8px 16px",
                      fontSize: "14px",
                      marginTop: "8px"
                    }}
                    placeholder={"????????? ??????????????????."}
                  />
                </div>
                <div style={{marginTop: "34px"}}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    ???????????? ??????
                    <Switch
                      isOn={switchValue}
                      handleToggle={() => {
                        setSwitchValue(!switchValue)
                      }}
                      color={"#34C759"}
                    />
                  </div>
                  {switchValue &&
                  <>
                    <div style={{opacity: 0.8, fontSize: "12px", marginTop: "8px"}}>
                      ???????????? ?????? ??? ??????????????? ????????? ??????????????? ????????? ??? ????????????.
                      ???????????? ????????? ????????? ?????? ????????? ????????? ????????? ????????? ??? ????????????.
                    </div>
                    <input
                      name="password"
                      onChange={onChange}
                      style={{
                        width: "362px",
                        height: "34px",
                        borderRadius: "4px",
                        border: "1px solid #C7C7C7",
                        outline: "none",
                        padding: "8px 16px",
                        fontSize: "14px",
                        marginTop: "16px"
                      }}
                      placeholder={"??????????????? ??????????????????."}
                    />
                  </>
                  }

                </div>
              </div>

              <div>
                <div style={{
                  fontSize: "16px",
                  alignItems: "flex-start",
                  display: "flex",
                  color: "white",
                  marginTop: "32px"
                }}>
                  ?????? ??????
                  <div style={{fontSize: "16px"}}>*</div>
                </div>
                <select
                  name="purposeId"
                  onChange={onChange}
                  style={{marginTop: "8px", width: "100%", height: "40px", borderRadius: "4px", padding: "6px 16px"}}>
                  <option value={0}>?????? ????????? ??????????????????.</option>
                  <option value={1}>?????? ?????? ?????? & ??????????????? ??????</option>
                  <option value={2}>?????? / ??????????????? ????????? ??????</option>
                  <option value={3}>?????? ???????????? ??????</option>
                  <option value={4}>?????????, ???????????? ????????? ??????</option>
                  <option value={5}>??????</option>
                </select>
              </div>
            </div>

            <div
              onClick={createNewRoom}
              style={{
                backgroundColor: "#27D96E",
                height: "52px",
                width: "362px",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontSize: "16px",
                marginBottom: "32px"
              }}>
              ??? ?????? ????????? +
            </div>
          </div>
        </div>
      }
    </div>
  )
}

function Space({setIsMenu, setMenuTitle, setPresetId, roomCategory}) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [mapId, setMapId] = useState(undefined);

  return (
    <div style={{marginBottom: "81px"}}>
      <div style={{color: "#1C1C1E", fontSize: "20px", fontWeight: "bold"}}>
        {roomCategory.categoryName} <span style={{color: "#AEAEAE"}}>{roomCategory.rooms.length}</span>
      </div>

      <div style={{display: "flex", marginTop: "24px"}}>

        {roomCategory.rooms.map((item => {
          return (
            <div
              key={item.roomId}
              onMouseLeave={() => {
                setMapId(undefined)
                setFocus(false)
                setHover(false)
              }}
              onMouseEnter={() => {
                setMapId(item.roomId)
                setHover(true)
              }}
              onClick={() => {
                setMapId(item.roomId)
                setFocus(true)
                setHover(!hover)
                setIsMenu(true)
                setMenuTitle(item.roomName)
                setPresetId(301)
              }}
            >
              <div
                style={{
                  display: "flex",
                  marginRight: "20px",
                  backgroundColor: "white",
                  borderRadius: "20px",
                  width: "352px",
                  height: "359px",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: hover ? mapId === item.roomId ? "0px 4px 24px rgba(0, 0, 0, 0.1)" : null : null,
                  border: hover ? null : focus ? mapId === item.roomId ? "2px solid #501C90" : null : null
                }}
              >
                <div style={{position: "relative"}}>
                  <img style={{width: "336px", height: "220px", padding: "8px"}} src={item.image}/>
                  <div style={{
                    width: "80px",
                    height: "24px",
                    backgroundColor: "#5E1CAF",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                    position: "absolute",
                    right: "20px",
                    bottom: "20px",
                    fontSize: "14px"
                  }}>?????? {item.userLimit}???
                  </div>
                </div>
                <div style={{padding: "32px 20px"}}>
                  <div style={{fontSize: "20px", fontWeight: "bold", color: "#3A3A3C"}}>{item.roomName}</div>
                  <div style={{
                    fontSize: "14px",
                    color: "#636363",
                    marginTop: "6px",
                    lineHeight: "20px",
                    width: "312px",
                    marginBottom: "32px"
                  }}>{item.description}</div>
                </div>
              </div>
            </div>
          )
        }))}
      </div>
    </div>
  )
}
