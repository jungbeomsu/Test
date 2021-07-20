import Modal from "react-modal";
import React from "react";

export default function Popup({showPopup, setPopup, closeModal, type}) {

  return (
    <Modal
      isOpen={showPopup}
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
        정말로 [공간의 이름]에서 나가시겠습니까?
        </div>

        <div style={{display: "flex", marginTop: "30px", justifyContent: "space-evenly", width: "100%"}}>
          <div
            onClick={() => {
              setPopup(false);
              closeModal();
            }}>
            확인
          </div>
          <div onClick={() => setPopup(false)}>
            취소
          </div>
        </div>
      </div>
    </Modal>
  )
}
