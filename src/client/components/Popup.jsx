import TwoBtnPopup from "./TwoBtnPopup";
import OneBtnPopup from "./OneBtnPopup";
import React from "react";

export default function Popup(props) {
  const {messages, showTwoBtnPopup, setTwoBtnPopup, setOneBtnPopup, showOneBtnPopup, events} = props;

  return (
    <>

      {showTwoBtnPopup && <TwoBtnPopup message={messages.two} event={events.two} showTwoBtnPopup={showTwoBtnPopup} setTwoBtnPopup={setTwoBtnPopup} setOneBtnPopup={setOneBtnPopup}/>}
      {showOneBtnPopup && <OneBtnPopup message={messages.one} event={events.one} showOneBtnPopup={showOneBtnPopup} setOneBtnPopup={setOneBtnPopup} />}
    </>
  )
}
