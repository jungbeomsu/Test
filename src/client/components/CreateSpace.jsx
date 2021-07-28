import React, {useState, useEffect} from 'react';
import "./Dashboard.css";
import {leftArrow} from "../resources/images";
import Switch from "./Switch";
import {useHistory} from "react-router-dom";
import {makeId} from "../utils";
import {useDispatch} from "react-redux";
import {setRoomInfo} from "../redux/features/room/roomInfoSlice";
import GetServerDataWithToken from "../api/GetServerDataWithToken";
import axios from "axios";
import {Config} from "../constants";
import {amplitudeAnonInstance} from "../amplitude";

const rawRoomList = [
  {
    "category_id": 10,
    "category_name": "오피스",
    "rooms": [
      {
        "description": "테누토 사무실 맵입니다",
        "id": 1,
        "max_user_limit": 99,
        "name": "tenuto맵",
        "resource": "tenuto",
        "thumbnail_image": "https://s3.ap-northeast-2.amazonaws.com/centimeter.dev/room_preset/thumb_medium_office.png"
      }
    ]
  },
  {
    "category_id": 20,
    "category_name": "카페, 정원",
    "rooms": [
      {
        "description": "테누토 사무실 면접용 맵입니다",
        "id": 2,
        "max_user_limit": 99,
        "name": "tenuto면접장",
        "resource": "tenuto_interview",
        "thumbnail_image": "https://s3.ap-northeast-2.amazonaws.com/centimeter.dev/room_preset/thumb_medium_office.png"
      },
      {
        "description": "루프탑파티 설명",
        "id": 6,
        "max_user_limit": 99,
        "name": "루프탑파티",
        "resource": "rooftop_party",
        "thumbnail_image": "https://s3.ap-northeast-2.amazonaws.com/centimeter.dev/room_preset/thumb_cafe_1.png"
      },
      {
        "description": "센티미터카페 설명",
        "id": 7,
        "max_user_limit": 99,
        "name": "센티미터카페",
        "resource": "centimeter_cafe",
        "thumbnail_image": "https://s3.ap-northeast-2.amazonaws.com/centimeter.dev/room_preset/thumb_cafe_2.png"
      }
    ]
  },
  {
    "category_id": 30,
    "category_name": "단체 공간",
    "rooms": [
      {
        "description": "스타트업오피스 설명",
        "id": 3,
        "max_user_limit": 99,
        "name": "스타트업오피스",
        "resource": "startup_office",
        "thumbnail_image": "https://s3.ap-northeast-2.amazonaws.com/centimeter.dev/room_preset/thumb_startup_office.png"
      },
      {
        "description": "소형모던 설명",
        "id": 4,
        "max_user_limit": 99,
        "name": "소형모던오피스",
        "resource": "small_office",
        "thumbnail_image": "https://s3.ap-northeast-2.amazonaws.com/centimeter.dev/room_preset/thumb_small_office.png"
      },
      {
        "description": "중형모던오피스 설명",
        "id": 5,
        "max_user_limit": 99,
        "name": "중형모던오피스",
        "resource": "medium_office",
        "thumbnail_image": "https://s3.ap-northeast-2.amazonaws.com/centimeter.dev/room_preset/thumb_medium_office.png"
      }
    ]
  }
]

// const roomList = [
//   {
//     category: "office",
//     rooms: [
//       {
//         description: "테누토 사무실1",
//         id: 1,
//         max_user_limit: 99,
//         name: "테누토 맵",
//         url: "외부 이미지 url",
//       },
//       {
//         description: "테누토 사무실2",
//         id: 2,
//         max_user_limit: 99,
//         name: "테누토 맵",
//         url: "외부 이미지 url",
//       },
//       {
//         description: "테누토 사무실3",
//         id: 3,
//         max_user_limit: 99,
//         name: "테누토 맵",
//         url: "외부 이미지 url",
//       },
//     ]
//   },
//   {
//     category: "cafe",
//     rooms: [
//       {
//         description: "테누토 카페",
//         id: 4,
//         max_user_limit: 99,
//         name: "테누토 맵",
//         url: "외부 이미지 url",
//       },
//       {
//         description: "테누토 카페",
//         id: 5,
//         max_user_limit: 99,
//         name: "테누토 맵",
//         url: "외부 이미지 url",
//       }
//     ]
//   }
// ]

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
    GetServerDataWithToken(null, '/v1/setting/room_preset/get', (res) => {
      console.log('res room_preset ~~ ', res.room_preset_list);
      setRoomList(res.room_preset_list);

    }, (e) => {
      console.log("error:" + JSON.stringify(error))
    })
  }, [])

  const goToHome = () => {
    history.push({pathname: "/dashboard"})
  }

  console.log('roomList /////// ', roomList);

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
      name: roomname,
      password: password,
      has_password: hasPassword,
      purpose_id: purposeId,
      room_preset_id: presetId
    };

    GetServerDataWithToken(roomData, "/v1/room/create", (res) => {

    }, (e) => {
      console.log("error:" + JSON.stringify(error))
    })

    history.push({pathname: "/dashboard"})
  }

  // const createNewRoom = () => {
    // TODO: 우리 서버에 보낼 데이터
    // const data = {
    // name : "test room 이름13",
    // purpose_id : 1,
    // preset_id : 301, <- mapId
    // has_password : true,
    // password : "tenuto",
    // creator_id: 3 <- 방 만든 사람 Id
    // }

    // let roomName = randomId + "\\" + roomname;

    // TODO: 이걸로 바꿔야함
    // let roomName = "room" + "\\" + room;

    //   const req = {
    //     map: presetId,
    //     modPassword: "",
    //     name: roomName,
    //     password: password,
    //   }
    //
    //   axios.post(Config.apiServerPrefix + '/api/createRoom', req)
    //     .then((response) => {
    //       console.log('responded with ', response.status, ' ', response.statusText);
    //       if (response.status === 201) {
    //         amplitudeAnonInstance.logEvent('Create Private', {
    //           'room': roomName,
    //           'hasPassword': (password !== ""),
    //           'map': presetId
    //         });
    //         amplitudeAnonInstance.setUserId(null);
    //         amplitudeAnonInstance.regenerateDeviceId();
    //
    //         // setIsSetting(true);
    //
    //         history.push({pathname: "/dashboard", url: `/${randomId}/${roomname}`})
    //       }
    //     })
    // }

  return (
    <div style={{display: "flex", justifyContent: isMenu ? "space-between" : "center", alignItems: "center", flexDirection: isMenu ? null : "column", backgroundColor: "white", width: "100vw", height: "100vh", overflow: "hidden"}}>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
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

          <div style={{marginTop: "114px", overflow: "scroll"}}>
            {roomList.map((roomCategory) => {
              return (
                <Space roomCategory={roomCategory} setIsMenu={setIsMenu} setMenuTitle={setMenuTitle} setPresetId={setPresetId}/>
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

// function Space({setIsMenu, setMenuTitle, setPresetId, roomList}) {
//   const [hover, setHover] = useState(false);
//   const [focus, setFocus] = useState(false);
//   const [mapId, setMapId] = useState(undefined);
//
//   return (
//     <div style={{display: "flex"}}>
//       {roomList?.map((item) => {
//         return (
//           <div key={item.id}>
//             <div style={{color: "#1C1C1E", fontSize: "20px", fontWeight: "bold"}}>
//               {item.category_description} <span style={{color: "#AEAEAE"}}>{item.length}</span>
//             </div>
//             <div style={{display: "flex", marginTop: "24px"}}>
//               <div
//                 onMouseLeave={() => {
//                   setMapId(undefined)
//                   setHover(false)
//                   setFocus(false)
//                 }}
//                 onMouseEnter={() => {
//                   setMapId(item.id)
//                   setHover(true)
//                 }}
//                 onClick={() => {
//                   setMapId(item.id)
//                   setFocus(true)
//                   setHover(!hover)
//                   setIsMenu(true)
//                   setMenuTitle(item.name)
//                   setPresetId(301)
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     marginRight: "20px",
//                     backgroundColor: "white",
//                     borderRadius: "20px",
//                     width: "352px",
//                     height: "359px",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     boxShadow: hover ? mapId === item.id ? "0px 4px 24px rgba(0, 0, 0, 0.1)" : null : null,
//                     border: hover ? null : focus && mapId === item.id ? "2px solid #501C90" : null,
//                   }}
//                 >
//                   <div style={{position: "relative"}}>
//                     <img style={{width: "336px", height: "220px", padding: "8px"}} src={item.image}/>
//                     <div style={{width: "80px", height: "24px", backgroundColor: "#5E1CAF", color: "white", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", position: "absolute", right: "20px", bottom: "20px", fontSize: "14px"}}>{item.max_user_limit}</div>
//                   </div>
//                   <div style={{padding: "32px 20px"}}>
//                     {/*<div style={{fontSize: "20px", fontWeight: "bold", color: "#3A3A3C"}}>{item.name}</div>*/}
//                     <div style={{fontSize: "14px", color: "#636363", marginTop: "6px", lineHeight: "20px", width: "312px", marginBottom: "32px"}}>{item.description}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )
//       })}
//
//     </div>
//   )
// }

/*
* roomCategory:
* -
* {
*   category_name: "오피스",
*   category_id: 1,
*   rooms: [
*     {},
*     {},
*     {},
  // ]
*/

function Space({setIsMenu, setMenuTitle, setPresetId, roomCategory}) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [mapId, setMapId] = useState(undefined);

  console.log('roomCategory', roomCategory);

  return (

    <div style={{marginTop: "81px"}}>
      <div style={{color: "#1C1C1E", fontSize: "20px", fontWeight: "bold"}}>
        {roomCategory.category_name} <span style={{color: "#AEAEAE"}}>{roomCategory.rooms.length}</span>
      </div>

      <div style={{display: "flex", marginTop: "24px"}}>

        {roomCategory.rooms.map((item => {
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
                  <img style={{width: "336px", height: "220px", padding: "8px"}} src={item.thumbnail_image}/>
                  <div style={{width: "80px", height: "24px", backgroundColor: "#5E1CAF", color: "white", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", position: "absolute", right: "20px", bottom: "20px", fontSize: "14px"}}>최대 {item.max_user_limit}인</div>
                </div>
                <div style={{padding: "32px 20px"}}>
                  <div style={{fontSize: "20px", fontWeight: "bold", color: "#3A3A3C"}}>{item.name}</div>
                  <div style={{fontSize: "14px", color: "#636363", marginTop: "6px", lineHeight: "20px", width: "312px", marginBottom: "32px"}}>{item.description}</div>
                </div>
              </div>
            </div>
          )
        }))}
      </div>
    </div>
  )
}


// function CafeMap({setIsMenu, setMenuTitle, setPresetId, data}) {
//   const [hover, setHover] = useState(false);
//   const [focus, setFocus] = useState(false);
//   const [mapId, setMapId] = useState(undefined);
//
//   return (
//     <div style={{marginTop: "81px"}}>
//       <div style={{color: "#1C1C1E", fontSize: "20px", fontWeight: "bold"}}>
//         카페, 정원 <span style={{color: "#AEAEAE"}}>{data.length}</span>
//       </div>
//
//       <div style={{display: "flex", marginTop: "24px"}}>
//
//         {data.length > 0 && data.map((item => {
//           return (
//             <div
//               key={item.id}
//               onMouseLeave={() => {
//                 setMapId(undefined)
//                 setFocus(false)
//                 setHover(false)
//               }}
//               onMouseEnter={() => {
//                 setMapId(item.id)
//                 setHover(true)
//               }}
//               onClick={() => {
//                 setMapId(item.id)
//                 setFocus(true)
//                 setHover(!hover)
//                 setIsMenu(true)
//                 setMenuTitle(item.name)
//                 setPresetId(301)
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   marginRight: "20px",
//                   backgroundColor: "white",
//                   borderRadius: "20px",
//                   width: "352px",
//                   height: "359px",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   boxShadow: hover ? mapId === item.id ? "0px 4px 24px rgba(0, 0, 0, 0.1)" : null : null,
//                   border: hover ? null : focus ? mapId === item.id ? "2px solid #501C90" : null : null
//                 }}
//               >
//                 <div style={{position: "relative"}}>
//                   <img style={{width: "336px", height: "220px", padding: "8px"}} src={item.image}/>
//                   <div style={{width: "80px", height: "24px", backgroundColor: "#5E1CAF", color: "white", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", position: "absolute", right: "20px", bottom: "20px", fontSize: "14px"}}>{item.limit}</div>
//                 </div>
//                 <div style={{padding: "32px 20px"}}>
//                   <div style={{fontSize: "20px", fontWeight: "bold", color: "#3A3A3C"}}>{item.name}</div>
//                   <div style={{fontSize: "14px", color: "#636363", marginTop: "6px", lineHeight: "20px", width: "312px", marginBottom: "32px"}}>{item.desc}</div>
//                 </div>
//               </div>
//             </div>
//           )
//         }))}
//       </div>
//     </div>
//   )
// }
