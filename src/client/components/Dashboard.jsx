import React, {useEffect, useState} from 'react';
import {
  exitIconG,
  memberIcon,
  profileIconL,
  settingIconG,
  createdRoomImage,
} from "../resources/images";
import {useSelector} from "react-redux";
import "./Dashboard.css";
import {useHistory} from "react-router-dom";
import {makeId} from "../utils";

export default function Dashboard(props) {
  const [nickname, setNickname] = useState(undefined);
  const [memberList, setMemberList] = useState([]);
  const [roomList, setRoomList] = useState([]);

  const history = useHistory();
  const accountData = useSelector(({account}) => account);
  const roomInfoData = useSelector(({roomInfo}) => roomInfo);

  let [randomId, _] = useState(makeId(16));

  useEffect(() => {
    setNickname(accountData.nickname);

    if (roomInfoData.roomname !== null) {
      setRoomList([...roomList, roomInfoData])
    }

  }, [])

  const goToCreateSpace = () => {
    history.push({pathname: "/space"})
  }

  const goToMainScreen = () => {
    history.push({pathname: `/${randomId}/${roomInfoData.roomname}`, url: `/${randomId}/${roomInfoData.roomname}`})
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
                    참여 중 {memberList.length}
                  </div>
                  <div style={{padding: "0 12px"}}>
                    <div style={{display: "flex", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.2)", height: "52px", borderRadius: "16px", width: "100%", color: "#F0F0F0", padding: "14px 12px"}}>
                      <div style={{marginRight: "16px", display: "flex", alignItems: "center"}}>
                        <div style={{marginRight: "4px", display: "flex", alignItems: "center"}}>
                          {memberIcon}
                        </div>
                        {memberList.length}
                      </div>
                      <div>
                        {room.roomname}
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
