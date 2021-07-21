import Modal from "react-modal";
import React, {useState} from "react";
import OneBtnPopup from "./OneBtnPopup";

export default function TwoBtnPopup({message, showTwoBtnPopup, setTwoBtnPopup, setOneBtnPopup}) {

  return (
    <>
      <Modal
        isOpen={showTwoBtnPopup}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.6)",
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            height: "150px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            padding: "20px",
          }}
        }
      >
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
          <div>
            {message}
          </div>
          <div style={{display: "flex", marginTop: "30px", justifyContent: "space-evenly", width: "100%"}}>
            <div
              onClick={() => {
                setOneBtnPopup(true);
                setTwoBtnPopup(false);
              }}>
              확인
            </div>
            <div onClick={() => setTwoBtnPopup(false)}>
              취소
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
