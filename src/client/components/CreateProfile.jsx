import React, {useState} from 'react';
import GameChangeCharacter from "./GameChangeCharacter";

export default function CreateProfile() {
  const [userName, setUserName] = useState(undefined);
  const [characterId, setCharacterId] = useState(211);

  let currentMap = 301;

  const goToTutorial = () => {
    alert(`이름 : ${userName} 캐릭터번호 : ${characterId} \n프로필이 저장되었습니다!`)
    // document.location.href="/tutorial";
  }

  return (
    <div style={{backgroundColor: "#EEEEEE",width: "100vw", height: "100vh", display: "flex", justifyContent: "space-evenly", alignItems: "center"}}>
      <div style={{fontSize: "20px", fontWeight: "bold"}}>
        <div style={{marginBottom: "50px"}}>처음이네? </div>
        <div>프로필 만들어 줘어어어 </div>
        <div style={{fontSize: "14px", fontWeight: "normal", marginTop: "10px"}}>프로필 만들어 줘어어어 </div>
      </div>
      <div style={{backgroundColor: "white", width: "650px", height: "650px", borderRadius: "15px", padding: "25px 20px", position: "relative"}}>
        <div style={{display: "flex", alignItems: "center"}}>
          <div style={{marginRight: "30px", fontSize: "20px", fontWeight: "bold"}}>이름</div>
          <input
            onChange={(e) => setUserName(e.target.value)}
            style={{border: "none", width: "80%", height: "50px", borderRadius: "15px", backgroundColor: "#EEEEEE"}}></input>
        </div>

        <div style={{marginTop: "100px", display: "flex"}}>
          <div style={{fontSize: "20px", fontWeight: "bold"}}>캐릭터</div>

          <div>
            <GameChangeCharacter
              setCharacterId={setCharacterId}
              characterId={characterId}
              currentMap={currentMap}
            />
          </div>
        </div>

        <div style={{position: "absolute", bottom: "50px", right: "50px", width: "100px", height: "36px", backgroundColor: "#EEEEEE", borderRadius: "15px", alignItems: "center", justifyContent: "center", display: "flex", fontWeight: "bold"}}>
          <div onClick={() => {
            setCharacterId(characterId)
            goToTutorial()
          }} style={{fontSize: "20px"}}>저장</div>
        </div>
      </div>
    </div>
  )
}
