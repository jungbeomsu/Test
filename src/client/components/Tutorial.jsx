import React, {useEffect, useState} from 'react';
import {cloud, town} from "../resources/images";
import {useHistory} from "react-router-dom";
import CentiToken from "../api/CentiToken";
import api from "../api/api";

export default function Tutorial() {
  const [nickname, setNickname] = useState(undefined);
  const history = useHistory();

  useEffect(() => {
    const userId = CentiToken.getUserId();
    api.getProfile(userId).then(res => {
      setNickname(res.nickname)
    })
  }, [])

  const goToDashboard = () => {
    history.push({pathname: "/dashboard"})
  }

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
          <div style={{marginBottom: "32px", color: "white", fontSize: "40px", fontWeight: "bold"}}>반갑습니다!</div>
          <div style={{
            marginBottom: "32px",
            color: "white",
            fontSize: "40px",
            fontWeight: "bold"
          }}>{nickname?.slice(0, 8) + "..."} 님
          </div>
          <div style={{fontSize: "16px", color: "white", fontWeight: "normal", opacity: 0.8}}>Amet minim mollit non
            deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
            Exercitation veniam consequat sunt nostrud amet.
          </div>
          <div
            onClick={goToDashboard}
            style={{
              textDecoration: "underline",
              fontSize: "16px",
              color: "white",
              marginTop: "40px",
              fontWeight: "normal",
              opacity: 0.8
            }}>건너뛰기
          </div>
        </div>
        <div style={{
          backgroundColor: "white",
          height: "500px",
          borderRadius: "15px",
          padding: "25px 20px",
          position: "relative",
          zIndex: 999,
          width: "650px",
          fontSize: "50px",
        }}>
          튜토리얼 입니다
        </div>
      </div>
      <div style={{position: "absolute", bottom: 0}}>
        {town}
      </div>
    </div>
  )
}
