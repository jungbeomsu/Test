import React, {useState} from 'react';
import "./Dashboard.css";
import {leftArrow} from "../resources/images";
import Switch from "./Switch";
import {useHistory} from "react-router-dom";
import {makeId} from "../utils";
import {useDispatch} from "react-redux";
import {setRoomInfo} from "../redux/features/room/roomInfoSlice";

const roomList =
  {
    office: [
      {id: 1, name: "스타트업 오피스", image: require("../images/v1/space_image.png").default, desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", limit: "10인 미만"},
      {id: 2, name: "소형 모던 오피스", image: require("../images/v1/space_image.png").default, desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", limit: "20인 미만"},
      {id: 3, name: "중형 모던 오피스", image: require("../images/v1/space_image.png").default, desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", limit: "20인 이상"},
    ],
    cafe: [
      {id: 1, name: "센티미터 카페", image: require("../images/v1/space_image.png").default, desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever", limit: "20인 미만"},
      {id: 2, name: "루프탑 파티", image: require("../images/v1/space_image.png").default, desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever", limit: "20인 미만"},
    ],
    restaurant: [
      {id: 1, name: "센티미터 카페", image: require("../images/v1/space_image.png").default, desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever", limit: "20인 미만"},
      {id: 2, name: "루프탑 파티", image: require("../images/v1/space_image.png").default, desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever", limit: "20인 미만"},
    ]
  }

export default function CreateSpace() {
  const [isMenu, setIsMenu] = useState(false);
  const [menuTitle, setMenuTitle] = useState(undefined);
  const [switchValue, setSwitchValue] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [presetId, setPresetId] = useState(undefined);

  const [inputs, setInputs] = useState({
    roomname: undefined,
    password: undefined,
    purposeId: undefined,
  })

  let [randomId, _] = useState(makeId(16));

  const {roomname, password, purposeId} = inputs;

  const history = useHistory();
  const dispatch = useDispatch();

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
    alert(`공간 이름 : ${roomname}\n비밀번호 : ${password} \n개설 목적: ${purposeId}\n공간 정보가 저장되었습니다!`);
    const roomData = {
      roomname,
      password: "",
      presetId,
    };

    console.log(roomData);
    dispatch(setRoomInfo(roomData));

    history.push({pathname: "/dashboard", data: inputs})
  }


  return (
    <div style={{display: "flex", justifyContent: isMenu ? "space-between" : "center", alignItems: "center", flexDirection: isMenu ? null : "column", backgroundColor: "white", width: "100vw", height: "100vh", overflow: "hidden"}}>
      <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <div style={{width: "1096px", height: "1374px", display: "flex", flexDirection: "column", justifyContent: "center"}}>
          <div
            onClick={goToHome}
            style={{display: "flex", justifyContent: "flex-start", width: "100%", alignItems: "center"}}>
            {leftArrow}
            <div style={{color: "#AEAEAE", fontSize: "16px", marginLeft: "8px"}}>홈으로 돌아가기</div>
          </div>

          <div style={{marginTop: "24px"}}>
            <div style={{fontSize: "24px", fontWeight: "bold", color: "#1C1C1E"}}>
              당신만의 공간을 선택해주세요!
            </div>
            <div style={{fontSize: "14px", color: "#636363", marginTop: "4px"}}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </div>
          </div>

          <div style={{overflow: "scroll", marginTop: "114px"}}>
            <OfficeMap setIsMenu={setIsMenu} setMenuTitle={setMenuTitle} setPresetId={setPresetId} data={roomList.office}/>
            <CafeMap setIsMenu={setIsMenu} setMenuTitle={setMenuTitle} setPresetId={setPresetId} data={roomList.cafe}/>
          </div>
        </div>
      </div>

      {isMenu &&
        <div style={{width: "410px", height: "100vh", backgroundColor: "#47335F", padding: "0px 24px"}}>
          <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%"}}>
            <div>
              <div style={{marginTop: "80px"}}>
                <div style={{display: "flex", alignItems: "flex-end"}}>
                  <div style={{fontSize: "28px", color: "white", fontWeight: "bold", marginRight: "4px"}}>{menuTitle}</div>
                  <span style={{fontSize: "14px", color: "white", opacity: 0.8}}>선택됨</span>
                </div>
                <div style={{marginTop: "22px", color: "white", opacity: 0.8, fontSize: "14px"}}>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</div>
              </div>

              <div style={{borderTop: "1px solid white", margin: "40px 0"}}/>
              <div style={{color: "white"}}>
                <div >
                  <div style={{fontSize: "16px", alignItems: "flex-start", display: "flex"}}>
                    공간 이름
                    <div style={{fontSize: "16px"}}>*</div>
                  </div>
                  <input
                    name="roomname"
                    onChange={onChange}
                    style={{width: "362px", height: "34px", borderRadius: "4px", border: "1px solid #C7C7C7", outline: "none", padding: "8px 16px", fontSize: "14px", marginTop: "8px"}}
                    placeholder={"이름을 입력해주세요."}
                  />
                </div>
                <div style={{marginTop: "34px"}}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    비밀번호 설정
                    <Switch
                      isOn={switchValue}
                      handleToggle={() => {setSwitchValue(!switchValue)}}
                      color={"#34C759"}
                    />
                  </div>
                  {switchValue &&
                    <>
                      <div style={{opacity: 0.8, fontSize: "12px", marginTop: "8px"}}>
                        비밀번호 설정 시 비밀번호를 입력한 사용자들만 참여할 수 있습니다.
                        설정하지 않으면 누구나 초대 링크만 있으면 공간에 참여할 수 있습니다.
                      </div>
                      <input
                        name="password"
                        onChange={onChange}
                        style={{width: "362px", height: "34px", borderRadius: "4px", border: "1px solid #C7C7C7", outline: "none", padding: "8px 16px", fontSize: "14px", marginTop: "16px"}}
                        placeholder={"비밀번호를 입력해주세요."}
                      />
                    </>
                  }

                </div>
              </div>

              <div>
                <div style={{fontSize: "16px", alignItems: "flex-start", display: "flex", color: "white", marginTop: "32px"}}>
                  개설 목적
                  <div style={{fontSize: "16px"}}>*</div>
                </div>
                <select
                  name="purposeId"
                  onChange={onChange}
                  style={{marginTop: "8px", width: "100%", height: "40px", borderRadius: "4px", padding: "6px 16px"}}>
                  <option value={0}>개설 목적을 선택해주세요.</option>
                  <option value={1}>사내 업무 협업 & 재택근무에 활용</option>
                  <option value={2}>가족 / 친구들과의 만남에 활용</option>
                  <option value={3}>교육 목적으로 활용</option>
                  <option value={4}>이벤트, 컨퍼런스 개최에 활용</option>
                  <option value={5}>기타</option>
                </select>
              </div>
            </div>

            <div
              onClick={createNewRoom}
              style={{backgroundColor: "#27D96E", height: "52px", width: "362px", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center", color: "white", fontSize: "16px", marginBottom: "32px"}}>
              새 공간 만들기 +
            </div>

          </div>
        </div>
      }

    </div>

  )
}

function OfficeMap({setIsMenu, setMenuTitle, setPresetId, data}) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [mapId, setMapId] = useState(undefined);

  return (
    <div>
      <div style={{color: "#1C1C1E", fontSize: "20px", fontWeight: "bold"}}>
        오피스 <span style={{color: "#AEAEAE"}}>{data.length}</span>
      </div>

      <div style={{display: "flex", marginTop: "24px"}}>

        {data.length > 0 && data.map((item) => {
          return (
            <div
              key={item.id}
              onMouseLeave={() => {
                setMapId(undefined)
                setHover(false)
                setFocus(false)
              }}
              onMouseEnter={() => {
                setMapId(item.id)
                setHover(true)
              }}
              onClick={() => {
                setMapId(item.id)
                setFocus(true)
                setHover(!hover)
                setIsMenu(true)
                setMenuTitle(item.name)
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
                  boxShadow: hover ? mapId === item.id ? "0px 4px 24px rgba(0, 0, 0, 0.1)" : null : null,
                  border: hover ? null : focus && mapId === item.id ? "2px solid #501C90" : null,
                }}
              >
                <div style={{position: "relative"}}>
                  <img style={{width: "336px", height: "220px", padding: "8px"}} src={item.image}/>
                  <div style={{width: "80px", height: "24px", backgroundColor: "#5E1CAF", color: "white", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", position: "absolute", right: "20px", bottom: "20px", fontSize: "14px"}}>{item.limit}</div>
                </div>
                <div style={{padding: "32px 20px"}}>
                  <div style={{fontSize: "20px", fontWeight: "bold", color: "#3A3A3C"}}>{item.name}</div>
                  <div style={{fontSize: "14px", color: "#636363", marginTop: "6px", lineHeight: "20px", width: "312px", marginBottom: "32px"}}>{item.desc}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CafeMap({setIsMenu, setMenuTitle, setPresetId, data}) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [mapId, setMapId] = useState(undefined);

  return (
    <div style={{marginTop: "81px"}}>
      <div style={{color: "#1C1C1E", fontSize: "20px", fontWeight: "bold"}}>
        카페, 정원 <span style={{color: "#AEAEAE"}}>{data.length}</span>
      </div>

      <div style={{display: "flex", marginTop: "24px"}}>

        {data.length > 0 && data.map((item => {
          return (
            <div
              key={item.id}
              onMouseLeave={() => {
                setMapId(undefined)
                setFocus(false)
                setHover(false)
              }}
              onMouseEnter={() => {
                setMapId(item.id)
                setHover(true)
              }}
              onClick={() => {
                setMapId(item.id)
                setFocus(true)
                setHover(!hover)
                setIsMenu(true)
                setMenuTitle(item.name)
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
                  boxShadow: hover ? mapId === item.id ? "0px 4px 24px rgba(0, 0, 0, 0.1)" : null : null,
                  border: hover ? null : focus ? mapId === item.id ? "2px solid #501C90" : null : null
                }}
              >
                <div style={{position: "relative"}}>
                  <img style={{width: "336px", height: "220px", padding: "8px"}} src={item.image}/>
                  <div style={{width: "80px", height: "24px", backgroundColor: "#5E1CAF", color: "white", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", position: "absolute", right: "20px", bottom: "20px", fontSize: "14px"}}>{item.limit}</div>
                </div>
                <div style={{padding: "32px 20px"}}>
                  <div style={{fontSize: "20px", fontWeight: "bold", color: "#3A3A3C"}}>{item.name}</div>
                  <div style={{fontSize: "14px", color: "#636363", marginTop: "6px", lineHeight: "20px", width: "312px", marginBottom: "32px"}}>{item.desc}</div>
                </div>
              </div>
            </div>
          )
        }))}
      </div>
    </div>
  )
}