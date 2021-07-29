import React, {useRef, useState} from 'react';
import GameChangeCharacter from "./GameChangeCharacter";
import {cloud, town} from "../resources/images";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setProfile} from "../redux/features/account/accountSlice";
import api from "../api/api";

export default function CreateProfile() {
  const [nickname, setNickname] = useState("내 이름은 지호에요");
  const [characterId, setCharacterId] = useState(211);
  const [nicknameChange, setNicknameChange] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  let currentMap = 301;

  const goToTutorial = () => {
    api.updateProfile(nickname, characterId)
      .then(res => {
        dispatch(setProfile(res));
        history.push({pathname: "/tutorial"});
      })
  }

  const inputRef = useRef();

  return (
    <div style={{
      backgroundColor: "#47335F",
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center"
    }}>
      <div style={{position: "absolute", top: 0}}>
        {cloud}
      </div>
      <div
        style={{zIndex: 9999999, display: "flex", alignItems: "center", justifyContent: "space-evenly", width: "100%"}}>
        <div style={{fontSize: "20px", fontWeight: "bold", width: "350px"}}>
          <div style={{marginBottom: "32px", color: "white", fontSize: "40px", fontWeight: "bold"}}>첫 방문이시군요?</div>
          <div style={{fontSize: "16px", color: "white", fontWeight: "normal", opacity: 0.8}}>Amet minim mollit non
            deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
            Exercitation veniam consequat sunt nostrud amet.
          </div>
        </div>
        <div style={{
          backgroundColor: "white",
          height: "500px",
          borderRadius: "15px",
          padding: "25px 20px",
          position: "relative",
          zIndex: 999,
        }}>
          <div style={{display: "flex", alignItems: "center",}}>
            <div style={{marginRight: "50px", fontSize: "14px"}}>닉네임</div>
            <div>

              <div style={{position: "relative", marginRight: "8px"}}>
                <input
                  ref={inputRef}
                  name="nickname"
                  onChange={(e) => setNickname(e.target.value)}
                  value={nickname}
                  disabled={!nicknameChange}
                  style={{
                    border: nicknameChange ? "1px solid #5E1CAF" : "none",
                    outline: "none",
                    width: "445px",
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
                    setNicknameChange(!nicknameChange);
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
                  {nicknameChange ? "저장" : "닉네임 변경"}
                </div>
              </div>
            </div>
          </div>
          <div style={{marginTop: "100px", display: "flex"}}>
            <div style={{fontSize: "14px", marginRight: "40px", marginTop: "8px"}}>캐릭터</div>
            <div>
              <GameChangeCharacter
                setCharacterId={setCharacterId}
                characterId={characterId}
                currentMap={currentMap}
              />
              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                fontSize: "10px",
                color: "#AEAEAE",
                marginRight: "8px"
              }}>*닉네임과 캐릭터는 자유롭게 변경하실 수 있습니다.
              </div>
            </div>
          </div>
          <div style={{
            position: "absolute",
            bottom: "24px",
            width: "540px",
            height: "36px",
            backgroundColor: "#5E1CAF",
            borderRadius: "8px",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            fontWeight: "bold"
          }}>
            <div onClick={() => {
              setCharacterId(characterId)
              goToTutorial()
            }} style={{fontSize: "20px", color: "white"}}> 프로필 저장
            </div>
          </div>
        </div>
      </div>
      <div style={{position: "absolute", bottom: 0}}>
        {town}
      </div>
    </div>
  )
}
