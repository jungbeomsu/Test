import React, {useState, useEffect} from 'react';
import {cloud, town} from "../resources/images";
import {useSelector} from "react-redux";
import {profileIconL, settingIconG, exitIconG} from "../resources/images";
import "./Dashboard.css";

export default function Dashboard(props) {
  const [nickname, setNickname] = useState(undefined);
  // const [characterId, setCharacterId] = useState(undefined);
  // const [nicknameChange, setNicknameChange] = useState(false);

  const [memberList, setMemberList] = useState([]);
  const [roomList, setRoomList] = useState([]);

  const userData = useSelector(({userData}) => userData);

  useEffect(() => {
    setNickname(userData.nickname);
    // setCharacterId(userData.characterId);

  }, [])

  const goToSetting = () => {
    history.push({pathname: "/setting"})
  }

  return (
    <div style={{width: "100vw", height: "100vh", display: "flex"}}>
      <div style={{width: "304px", height: "100vh", backgroundColor: "#47335F"}}>
        <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "32px 24px"}}>
          <div>
            <div style={{display: "flex"}}>
              <div style={{color: "white", fontSize: "32px"}}>C
                <span style={{fontSize: "28px"}}>enti</span>
              </div>
              <div style={{color: "white", fontSize: "32px"}}>M
                <span style={{fontSize: "28px"}}>eter</span>
              </div>
            </div>

            <div style={{display: "flex", alignItems: "center", marginTop: "80px"}}>
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

            <div style={{marginTop: "40px", color: "#C7C7C7", fontSize: "12px"}}>
              참여 중 {memberList.length}
            </div>
          </div>
          <div
            onClick={goToSetting}
            style={{color: "#F0F0F0", border: "1px solid #F0F0F0", borderRadius: "8px", height: "32px", display: "flex", justifyContent: "center", alignItems: "center", }}>
            새 공간 만들기 +
          </div>
        </div>
      </div>

      <div style={{backgroundColor: "black", height: "100vh", width: "100%", position: "relative"}}>
        {roomList.length <= 0 &&
          <div className="dashboard-modal">
            <div>
              <div style={{color: "#3A3A3C", fontSize: "28px", fontWeight: "bold", marginBottom: "8px"}}>아직 참여한 공간이 없습니다!</div>
              <div style={{color: "#636363", fontSize: "16px", width: "100%", display: "flex", justifyContent: "center"}}>새 공간을 만들고 친구들을 초대해보세요!</div>
            </div>

            <div
              onClick={goToSetting}
              style={{backgroundColor: "#27D96E", height: "46px", width: "400px", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center", color: "white", fontSize: "16px", marginTop: "52px"}}>
              새 공간 만들기 +
            </div>

          </div>
        }
      </div>

    </div>
  )
}
