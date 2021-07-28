import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GameComponent from './GameComponent.jsx';
import { amplitudeAnonInstance, amplitudeInstance } from '../amplitude';
import { getRoomFromPath } from '../utils';
import {Config, auth} from '../constants';
import Setting from "./Setting";

export default function MainScreen() {
  const [hasPassword, setHasPassword] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [password, setPassword] = useState('');
  const [hasLinks, setHasLinks] = useState(false);
  const [url1, setURL1] = useState();
  const [url2, setURL2] = useState();
  const [name1, setName1] = useState();
  const [name2, setName2] = useState();
  const [isSetting, setIsSetting] = useState(false);

  function startGame(password) {
    if (password) {
      setPassword(password);
    }
  }

  useEffect(() => {
    // if (!hasPassword || hasAccess) {
      startGame();
    // }
  }, []);

  return (
    <>
      {isSetting ?
        <GameComponent
          inGame={true}
          // isPrivate={true}
          password={password}
          // setHasAlternateLayout={setHasAlternateLayout}
          // setShowHeader={setShowHeader}
          setHasLinks={setHasLinks}
          setName1={setName1}
          setName2={setName2}
          setURL1={setURL1}
          setURL2={setURL2}
          hasLinks={hasLinks}
          name1={name1}
          name2={name2}
          url1={url1}
          url2={url2}
        />  :
        <Setting setIsSetting={setIsSetting}/>
      }
    </>
  );
}
