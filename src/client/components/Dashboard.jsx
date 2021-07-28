import React, {useEffect, useState} from 'react';
import {
  exitIconG,
  memberIcon,
  profileIconL,
  settingIconG,
  createdRoomImage,
} from "../resources/images";
import "./Dashboard.css";
import {useHistory, useLocation} from "react-router-dom";
import {getRoomFromPath, makeId} from "../utils";
import GetServerDataWithToken from "../api/GetServerDataWithToken";
import jwt_decode from "jwt-decode";
import GetGameServerDataWithToken from "../api/GetGameServerDataWithToken";

export default function Dashboard(props) {
  const [nickname, setNickname] = useState(undefined);
  const [memberList, setMemberList] = useState({});
  const [roomList, setRoomList] = useState([]);
  const history = useHistory();

  const location = useLocation();
  const temp = location.url ? location.url.slice(1,).split("/") : null;

  let [randomId, _] = useState(makeId(16));

  useEffect(() => {

    // TODO: 실시간 멤버수 게임서버 API 호출해야함

    // axios.post(gameServerAPIURL() + 'roomInfo', {
    //   room: getRoomFromPath(),
    // }).then((res) => {
    //   // res === 3;
    // }).catch(() => {
    //   // tfaile
    // })

    const tokenInfo = jwt_decode(localStorage.getItem("@access_token"));
    const user_id = tokenInfo.UserId;
    const req = {
      user_id,
    }

    GetServerDataWithToken(req, "/v1/user/get", (res) => {
      setNickname(res.nickname);

    }, (error) => {
      console.log("error:" + JSON.stringify(error))
    });

    GetServerDataWithToken(null, "/v1/room/list/get", (res) => {
      setRoomList(res.room_list);
    }, (error) => {console.log("error:" + JSON.stringify(error))
    })

  }, [])

  useEffect(()=>{
    roomList.forEach(r => {
      GetGameServerDataWithToken({room: r.room_url}, "/roomInfo", (res) => {
        console.log(`실시간 멤버수: ${r.room_url}:  ${res.data}`);
        // setMemberList(prev => Object.assign(prev, {[r.room_url.toString()] : res.data}));
        setMemberList((prevMemberList) => {
          let newMemberList = Object.assign({}, prevMemberList);
          newMemberList[r.room_url] = res.data;
          return newMemberList;
        });
      }, (console.error));
    })
  }, [roomList])


  const goToCreateSpace = () => {
    history.push({pathname: "/space"})
  }

  const goToMainScreen = () => {
    history.push({pathname: `/${temp[0]}/${temp[1]}`})
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
                로그아웃
              </div>
            </div>

            {roomList.length > 0 && roomList.map((room, idx) => {

              return (
                <div key={idx}>
                  <div style={{marginTop: "40px", color: "#C7C7C7", fontSize: "12px", marginBottom: "8px", padding: "0 24px"}}>
                    참여 중
                    {memberList[room.room_url]}
                  </div>
                  <div style={{padding: "0 12px"}}>
                    <div style={{display: "flex", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.2)", height: "52px", borderRadius: "16px", width: "100%", color: "#F0F0F0", padding: "14px 12px"}}>
                      <div style={{marginRight: "16px", display: "flex", alignItems: "center"}}>
                        <div style={{marginRight: "4px", display: "flex", alignItems: "center"}}>
                          {memberIcon}
                        </div>
                        {memberList[room.room_url]}
                      </div>
                      <div>
                        {room.name}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
            <div
              onClick={goToCreateSpace}
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
              <div style={{position: "absolute", top: "80px", left: "24px", color: "#C7C7C7", fontSize: "12px"}}>접속 중 0</div>

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
