import Modal from "react-modal";
import React from "react";

export default function InviteModal({modalIsOpen, closeModal}) {

  return (
    <div>
      <Modal
        isOpen={modalIsOpen.invite}
        onRequestClose={closeModal}
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
            width: "460px",
            height: "370px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            padding: "50px 25px"
          }}
        }
        contentLabel="Example Modal"
      >
        <div style={{color: "#5E1CAF", fontSize: "32px", fontWeight: "bold", marginBottom: "9px"}}>LOGO</div>
        <div style={{color: "#1C1C1E", fontSize: "20px", fontWeight: "bold"}}>링크로 친구를 초대하기</div>
        <div style={{color: "#636363", fontSize: "12px", lineHeight: "17px"}}>친구를 초대하여 어 음... 멘트는 나중에 채워넣자</div>

        <div style={{marginTop: "40px", display: "flex", width: "100%", flexDirection: "column"}}>
          <div style={{color: "#636363", fontSize: "10px", marginBottom: "6px"}}>초대 링크</div>
          <div style={{marginBottom: "16px", backgroundColor: "#F0F0F0", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", paddingLeft: "16px"}}>https://gather.town/app/3YhtaxRX52c6XjkQ/tenuto2</div>
          <div style={{marginBottom: "12px", backgroundColor: "#5E1CAF", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", color: "white", justifyContent: "center"}}>초대 링크 복사하기</div>
          <div style={{color: "#636363", fontSize: "10px", display: "flex", justifyContent: "center", textDecoration: "underline"}}>나중에 초대하기</div>
        </div>
      </Modal>
    </div>
  )
}
