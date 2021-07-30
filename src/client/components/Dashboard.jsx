import React, {useEffect, useState} from 'react';
import {createdRoomImage, errorIcon, exitIconG, memberIcon, profileIconL, settingIconG,} from "../resources/images";
import "./Dashboard.css";
import {useHistory, useLocation} from "react-router-dom";
import {makeId} from "../utils";
import GetGameServerDataWithToken from "../api/GetGameServerDataWithToken";
import CentiToken from "../api/CentiToken";
import api from "../api/api";
import RoomList from "./RoomList";
import './Dashboard.css';
import {setRoomId, setUserId} from "../redux/features/common/commonSlice";
import {useDispatch} from "react-redux";

const {Kakao} = window;

export default function Dashboard(props) {
  const [nickname, setNickname] = useState(undefined);
  const [activeUsers, setActiveUsers] = useState({});
  const [roomCount, setRoomCount] = useState(undefined);
  const [roomList, setRoomList] = useState([]);
  const [targetRoomId, setTargetRoomId] = useState(undefined);
  const [targetRoomUrl, setTargetRoomUrl] = useState('');
  const [hover, setHover] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  let [randomId, _] = useState(makeId(16));

  useEffect(() => {
    const userId = CentiToken.getUserId();
    api.getProfile(userId).then(res => {
      setNickname(res.nickname)
    })
    api.getRoomList().then(res => {
      setRoomCount(res.roomCount)
      setRoomList(res.roomList)
    })

  }, [])

  useEffect(()=>{
    let roomUrls = roomList.map(r => r.roomUrl);
    GetGameServerDataWithToken({rooms: roomUrls}, '/roomsInfo', (res) => {
      setActiveUsers(res.data);
    })

  }, [roomList])

  const goToCreateSpace = () => {
    history.push({pathname: "/space"})
  }

  const goToMainScreen = () => {
    if(targetRoomUrl!== ''){
        dispatch(setRoomId(targetRoomId));
        history.push({pathname: `/room/${targetRoomUrl}`});
    }
    else{
      alert('방을 선택해주세요!');
    }
  }

  const getRoomActiveUsers = (roomList) => {
    const roomUrl = roomList.find(r => {
      if (r.roomUrl === targetRoomUrl) return targetRoomUrl
    })?.roomUrl

    return activeUsers[roomUrl]
  }

  const logOut = () => {
    console.log("로그아웃")
    // TODO: dispatch 에러 해결하기
    CentiToken.remove();
    Kakao.Auth.logout();
    dispatch(setUserId(null));
    history.push({pathname: "/"})
  }

  return (
    <div style={{width: "100vw", height: "100vh", display: "flex"}}>
      <div style={{width: "304px", height: "100vh", backgroundColor: "#47335F"}}>
        <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", width: "304px"}}>
          <div>
            <div style={{display: "flex", padding: "32px 24px"}}>
              <div style={{color: "white", fontSize: "32px"}}>C
                <span style={{fontSize: "28px"}}>enti</span>
              </div>
              <div style={{color: "white", fontSize: "32px"}}>M
                <span style={{fontSize: "28px"}}>eter</span>
              </div>
            </div>
            <div style={{display: "flex", alignItems: "center", marginTop: "80px", padding: "0 24px"}}>
              <div style={{position: "relative", display: "inline-block", marginRight: "8px"}}>
                {profileIconL}
                <div style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#00FF47",
                  borderRadius: "50%",
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  border: "2px solid white"
                }}>
                </div>
              </div>
              <div style={{color: "#F0F0F0"}}>{nickname}</div>
            </div>
            <div style={{padding: "0 24px"}}>
              <div style={{marginTop: "40px", color: "#C7C7C7", fontSize: "12px"}}>
                개인 설정
              </div>
              <div style={{display: "flex", alignItems: "center", color: "#F0F0F0", padding: "15px 15px 15px 0"}}>
                <div style={{marginRight: "8px"}}>
                  {settingIconG}
                </div>
                프로필 설정
              </div>
              <div style={{display: "flex", alignItems: "center", color: "#F0F0F0", padding: "15px 15px 15px 0"}}>
                <div style={{marginRight: "8px"}}>
                  {exitIconG}
                </div>
                <div onClick={logOut}>
                  로그아웃
                </div>
              </div>
            </div>

            <RoomList roomCount={roomCount} roomList={roomList} setTargetRoomUrl={setTargetRoomUrl} activeUsers={activeUsers} targetRoomUrl={targetRoomUrl} setTargetRoomId={setTargetRoomId}/>

          </div>
          <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
            <div
              onMouseOut={() => setHover(false)}
              onMouseOver={() => setHover(true)}
              onClick={goToCreateSpace}
              style={{
                color: hover ? "#3A3A3C" : "#F0F0F0",
                border: hover ? "none" : "1px solid #F0F0F0",
                borderRadius: "8px",
                height: "46px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "32px",
                padding: "0 24px",
                width: "276px",
                backgroundColor: hover && "white"
              }}>
              새 공간 만들기 +
            </div>
          </div>
        </div>
      </div>
      {roomList.length <= 0 ?
        <div style={{backgroundColor: "black", height: "100vh", width: "100%", position: "relative"}}>
          <div className="dashboard-modal">
            <div>
              <div style={{color: "#3A3A3C", fontSize: "28px", fontWeight: "bold", marginBottom: "8px"}}>아직 참여한 공간이 없습니다!</div>
              <div style={{color: "#636363", fontSize: "16px", width: "100%", display: "flex", justifyContent: "center"}}>새 공간을 만들고 친구들을 초대해보세요!</div>
            </div>
            <div
              onClick={goToCreateSpace}
              style={{backgroundColor: "#27D96E", height: "46px", width: "400px", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center", color: "white", fontSize: "16px", marginTop: "52px"}}>
              새 공간 만들기 +
            </div>
          </div>
        </div>
        :
        <div style={{backgroundImage: `url(${createdRoomImage})`, height: "100%", width: "100%",  backgroundRepeat : "no-repeat", backgroundSize : "cover"}}>
          <div style={{backgroundColor: "#47335F", width: "304px", height: "100vh", position: "absolute", right: 0}}>
            <div style={{}}>
              <div style={{color: "#C7C7C7", fontSize: "12px", marginBottom: "8px", paddingTop: "80px", paddingLeft: "24px"}}>
                접속 중 {getRoomActiveUsers(roomList)}
              </div>
              {
                getRoomActiveUsers(roomList) ?
                  <div style={{paddingLeft: "14px"}}>
                    {Array(getRoomActiveUsers(roomList)).fill(0).map((item, idx) => {
                      return (

                        <div key={idx} style={{display: "flex", alignItems: "center", padding: "10px 12px"}}>
                          <div style={{position: "relative", display: "inline-block", marginRight: "8px"}}>
                            {profileIconL}
                            <div style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: "#00FF47",
                              borderRadius: "50%",
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                              border: "2px solid white"
                            }}>
                            </div>
                          </div>
                          <div style={{fontSize: "16px",color: "#F0F0F0"}}>접속자 {idx+1}</div>
                        </div>
                      )
                    })}
                  </div>
                  :

                  <div className="no-user">
                    <div style={{display: "flex", justifyContent: "center", marginBottom: "4px"}}>
                      {errorIcon}
                    </div>
                    현재 참여중인 인원이 없습니다
                  </div>
              }
            </div>
            <div style={{position: "absolute", bottom: 0, width: "100%"}}>
              <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                <div
                  // onClick={goToCreateSpace}
                  style={{
                    color: "#F0F0F0",
                    border: "1px solid #F0F0F0",
                    borderRadius: "8px",
                    height: "46px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "32px",
                    padding: "0 24px",
                    width: "276px"
                  }}>
                  공간 설정
                </div>
              </div>

              <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                <div
                  onClick={goToMainScreen}
                  style={{
                    color: "#F0F0F0",
                    backgroundColor: "#27D96E",
                    borderRadius: "8px",
                    height: "46px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "32px",
                    padding: "0 24px",
                    width: "276px"
                  }}>
                  공간 입장
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}
