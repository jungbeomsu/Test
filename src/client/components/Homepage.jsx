import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom'
import axios from 'axios';

import YesNoPrompt from './YesNoPrompt.jsx';
import GameComponent from './GameComponent.jsx';
import PasswordPrompt from './PasswordPrompt.jsx';
import ProfileModal from './ProfileModal.jsx';
import Feedback from './Feedback.jsx';

import { localPreferences } from '../LocalPreferences.js';
import { updateUserData } from '../userData.js';
import { amplitudeAnonInstance, amplitudeInstance } from '../amplitude.js';
import { getRoomFromPath, getSubDomain } from '../utils.js';
import { db } from '../constants';

import KakaoLogin from "react-kakao-login";

import './Homepage.css';

const Twitter = '/images/site/twitter.png';
const {Kakao} = window;

const CreateRoom = (props) => {
  let [clicked, setClicked] = useState("");
  let [user, setUser] = useState(localPreferences.get("user"))

  let yesNoMessage = <div id="yes-no-message">
                        <p>Are you above the age of 18?
                          <span style={{fontWeight: "600"}}>
                            (required)
                          </span>
                        </p>
                      </div>;

  useEffect(() => {
    let handle = localPreferences.on("user", (info) => {
      setUser(user);
    })
    return () => {
      localPreferences.remove("user", handle);
    };
  }, [])

  let dialog = <div></div>;

  if (clicked === "") {
    dialog = (
      <div style={{
          backgroundColor: "#0EBF55",
          borderRadius: "10px",
          width: "130px",
          height: "34px",
          margin: "20px auto 20px",
          cursor: "pointer",
        }}
        onClick={() => {
          if (user.overAge) {
            props.onPrivate();
          } else {
            setClicked("private")
          }
        }}
        >
        <p className="button-text">CREATE ROOM</p>
      </div>
    );
  } else if (!user.overAge) {
    dialog = (
      <YesNoPrompt
        prompt={yesNoMessage}
        onYes={() => {
          updateUserData({ "overAge": true });
          props.onPrivate();
          setClicked("")
        }}
        onNo={() => { setClicked("") }}
      />
    );
  }
  return dialog;
}

function FeedbackLeft() {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div style={{position: "absolute", width: "100%", top: "40px", textAlign: "center"}}>
      <div style={{width: "600px", textAlign: "left", margin: "auto"}}>
        <div className="ot-header-feedback">
        <div className="action" onClick={() => {setShowFeedback(!showFeedback)}}>Feedback</div>
          { showFeedback ?
            <Feedback onCancel={() => {setShowFeedback(false)}}/>
            :
            <div></div>
          }
        </div>
      </div>
    </div>
  );
}

function Top() {

  let createRoom = (
    <CreateRoom
      onPrivate={() => {
        window.location.href = "/private"
      }}
    />
  );

  return (
    <div style={{maxWidth: "338px", textAlign: "center", marginTop: "100px"}} className="writing">
      {createRoom}
    </div>

  );
}

function LoginWithKakao({login}) {


  return (
    <div style={{
      width: '324px',
      height: '48px',
      background: '#FFE812',
      border: '1px solid #F0F0F0',
      boxSizing: 'border-box',
      borderRadius: '8px',
      marginBottom: '12px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
         onClick={login}>
      <div
        style={{
          fontWeight: 'normal',
          fontSize: '16px',
          lineHeight: '130%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#110000',
          marginTop: '4px',
        }}
      >
        카카오톡으로 로그인
      </div>
    </div>
  )
}

function LoggedIn() {

  return (
    <div style={{maxWidth: "338px", textAlign: "center", marginTop: "100px"}} className="writing">
      You Logged In
    </div>


  )
}

function Logout({logout}) {
  return (
    <div style={{
      width: '324px',
      height: '48px',
      background: 'powderblue',
      border: '1px solid #F0F0F0',
      boxSizing: 'border-box',
      borderRadius: '8px',
      marginBottom: '12px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
         onClick={logout}>
      <div
        style={{
          fontWeight: 'normal',
          fontSize: '16px',
          lineHeight: '130%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#110000',
          marginTop: '4px',
        }}
      >
        로그아웃
      </div>
    </div>
  )
}

export default function Homepage() {
  const [isLogin, setLogin] = useState(undefined);

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      setLogin(false);
    } else {
      setLogin(true);
      Kakao.API.request({
        url: '/v2/user/me'
      }).then((res) => console.log('/v2/user/me', res));
    }

  }, [isLogin])

  const login = () => {
    Kakao.Auth.login({
      success: function (authObj) {
        console.log('access_token, refresh_token : ', authObj.access_token, authObj.refresh_token);
        localStorage.setItem('access_token', authObj.access_token);
        localStorage.setItem('refresh_token', authObj.refresh_token);
        document.location.href = '/';
      },
      fail: function (err) {
        console.log(JSON.stringify(err))
      },
    })
  }

  const logout = () => {
    if (!Kakao.Auth.getAccessToken()) {
      console.log('Not logged in.');
      return;
    }

    Kakao.Auth.logout(function () {
      console.log(Kakao.Auth.getAccessToken());
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      document.location.href = '/';
    });
  }

  return (
    <div className={classNames({"vertical-center-container": true, "dark-mode": false})}>
      <FeedbackLeft />
      {isLogin ?
        <div>
          <LoggedIn />
          <Top />
          <Logout logout={logout}/>
        </div> :
        <div style={{marginTop:20}}>
            <LoginWithKakao login={login} />
        </div>
      }
    </div>
  );
}
