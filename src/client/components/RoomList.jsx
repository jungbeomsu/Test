import {memberIcon} from "../resources/images";
import React, {useState} from "react";

export default function RoomList({roomCount, roomList, setTargetRoomUrl, activeUsers, targetRoomUrl, setTargetRoomId}) {

  return (
    <>
      <div style={{marginTop: "40px", color: "#C7C7C7", fontSize: "12px", marginBottom: "8px", padding: "0 24px"}}>
        참여중인 공간 {roomCount}
      </div>
      <div style={{overflow: "scroll", height: "800px"}}>
        {roomList.length > 0 && roomList.map((room) => {
          return (
            <div
              key={room.roomId}
              onClick={() => {
                setTargetRoomUrl(room.roomUrl)
                setTargetRoomId(room.roomId)
              }}
              style={{marginBottom: "14px", overflow: "scroll"}}
            >
              <div style={{padding: "0 12px"}}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: targetRoomUrl === room.roomUrl ? "rgba(0, 0, 0, 0.2)" : "",
                  height: "52px",
                  borderRadius: "16px",
                  width: "100%",
                  color: "#F0F0F0",
                  padding: "14px 12px"
                }}>
                  <div style={{marginRight: "16px", display: "flex", alignItems: "center"}}>
                    <div style={{marginRight: "4px", display: "flex", alignItems: "center"}}>
                      {memberIcon}
                    </div>
                    {activeUsers[room.roomUrl]}
                  </div>
                  <div>
                    {room.roomName}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
