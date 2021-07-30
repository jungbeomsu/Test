import Modal from "react-modal";
import React from "react";

export default function OneBtnPopup({message, showOneBtnPopup, setOneBtnPopup, event, closeModal}) {

  return (
    <Modal
      isOpen={showOneBtnPopup}
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
              setOneBtnPopup(false);
              event();
              closeModalw()
            }}>
            확인
          </div>
        </div>
      </div>
    </Modal>
  )
}
