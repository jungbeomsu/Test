import React, {useState, useEffect} from 'react';
import {audio, camera, cloud, mediaSettingImageM, speaker, town} from "../resources/images";
import {useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import "./Setting.css";
import axios from "axios";
import {Config} from "../constants";
import {amplitudeAnonInstance} from "../amplitude";

export default function Setting({setIsSetting}) {
  const roomInfo = useSelector(({roomInfo}) => roomInfo);
  const history = useHistory();
  const { room, name } = useParams();

  const goToMainScreen = () => {
    // 우리 서버에 보낼 데이터
    // const data = {
    // name : "test room 이름13",
    // purpose_id : 1,
    // preset_id : 301, <- mapId
    // has_password : true,
    // password : "tenuto",
    // creator_id: 3 <- 방 만든 사람 Id
    // }

    let roomName = room + "\\" + name;

    const req = {
      map: roomInfo.presetId,
      modPassword: "",
      name: roomName,
      password: roomInfo.password,
    }

    axios.post(Config.apiServerPrefix + '/api/createRoom', req)
      .then((response) => {
        console.log('responded with ', response.status, ' ', response.statusText);
        if (response.status === 201) {
          amplitudeAnonInstance.logEvent('Create Private', {
            'room': roomName,
            'hasPassword': (roomInfo.password !== ""),
            'map': roomInfo.presetId
          });
          amplitudeAnonInstance.setUserId(null);
          amplitudeAnonInstance.regenerateDeviceId();

          setIsSetting(true);

          history.push({pathname: `/${room}/${name}`})
        }
      })
  }

  return (
    <div style={{backgroundColor: "#47335F",width: "100vw", height: "100vh", display: "flex", justifyContent: "space-evenly", alignItems: "center"}}>
      <div className="setting-modal">
        <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
          {mediaSettingImageM}
          <div style={{marginTop: "40px", width: "100%"}}>
            <div>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"}}>
                <div style={{display: "flex", alignItems: "center", marginRight: "75px"}}>
                  <div style={{marginRight: "5px"}}>
                    {camera}
                  </div>
                  카메라
                </div>
                <select style={{width: "424px", height: "30px", borderColor: "##5E1CAF"}} name="카메라 이름">
                  <option value="none">카메라1</option>
                  <option value="001">카메라2</option>
                  <option value="002">카메라3</option>
                </select>
              </div>
            </div>
            <div>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"}}>
                <div style={{display: "flex", alignItems: "center", marginRight: "75px"}}>
                  <div style={{marginRight: "4px"}}>
                    {audio}
                  </div>
                  오디오
                </div>
                <select style={{width: "424px", height: "30px", borderColor: "##5E1CAF"}} name="오디오 이름">
                  <option value="none">오디오1</option>
                  <option value="001">오디오2</option>
                  <option value="002">오디오3</option>
                </select>
              </div>
            </div>
            <div>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"}}>
                <div style={{display: "flex", alignItems: "center", marginRight: "75px"}}>
                  <div style={{marginRight: "4px"}}>
                    {speaker}
                  </div>
                  스피커
                </div>
                <select style={{width: "424px", height: "30px", borderColor: "##5E1CAF"}} name="스피커 이름">
                  <option value="none">스피커1</option>
                  <option value="001">스피커2</option>
                  <option value="002">스피커3</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={goToMainScreen}
          style={{
            height: "36px",
            width: "100%",
            backgroundColor: "#5E1CAF",
            color: "white",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            fontSize: "14px",
            borderRadius: "8px",
            marginTop: "35px",
          }}>
          입장하기
        </div>
      </div>
    </div>
  )
}
