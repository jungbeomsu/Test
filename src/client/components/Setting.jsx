import React, {useState, useEffect} from 'react';
import {audio, camera, cloud, mediaSettingImageM, speaker, town} from "../resources/images";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import "./Setting.css";

export default function Setting(props) {

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
