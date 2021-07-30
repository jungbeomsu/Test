import React, { useState } from 'react';
import GameComponent from './GameComponent.jsx';
import Setting from "./Setting";

export default function MainScreen() {
  const [isSetting, setIsSetting] = useState(false);

  return (
    <>
      {isSetting ?
        <GameComponent
          inGame={true}
        />  :
        <Setting setIsSetting={setIsSetting}/>
      }
    </>
  );
}
