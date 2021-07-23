import React, {useEffect, useState} from 'react';
import YesNoPrompt from './YesNoPrompt.jsx';
import Feedback from './Feedback.jsx';
import {localPreferences} from '../LocalPreferences.js';
import {updateUserData} from '../userData.js';
import {loginBackground, kakaoIcon, googleIcon, FacebookIcon} from "../resources/images";
import './Homepage.css';
import Modal from "react-modal";
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
    <div
      onClick={login}
      style={{
      width: '324px',
      height: '48px',
      background: '#FFE812',
      border: "none",
      boxSizing: 'border-box',
      borderRadius: '8px',
      marginBottom: '12px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{marginTop: "4px"}}>
        {kakaoIcon}
      </div>
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
          marginLeft: "2px"
        }}
      >
        카카오톡으로 로그인
      </div>
    </div>
  )
}

function LoginWithGoogle() {
  return (
    <div
      // onClick={login}
      style={{
        width: '324px',
        height: '48px',
        background: 'white',
        border: '1px solid #F0F0F0',
        boxSizing: 'border-box',
        borderRadius: '8px',
        marginBottom: '12px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <div style={{marginTop: "4px"}}>
        {googleIcon}
      </div>
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
          border: "#C7C7C7",
          marginLeft: "2px"
        }}
      >
        구글 계정으로 로그인
      </div>
    </div>
  )
}

function LoginWithFacebook() {
  return (
    <div
      // onClick={login}
      style={{
        width: '324px',
        height: '48px',
        background: '#1877F2',
        border: 'none',
        boxSizing: 'border-box',
        borderRadius: '8px',
        marginBottom: '12px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <div style={{marginTop: "4px"}}>
        {FacebookIcon}
      </div>
      <div
        style={{
          fontWeight: 'normal',
          fontSize: '16px',
          lineHeight: '130%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          marginTop: '4px',

          marginLeft: "2px"
        }}
      >
        페이스북 계정으로 로그인
      </div>
    </div>
  )
}

function Logout({logout}) {
  return (
    <div
      onClick={logout}
      style={{
        backgroundColor: "forestgreen",
        width: "200px",
        height: "60px",
        borderRadius: "10px",
        color: "white",
        fontSize: "25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          fontWeight: 'normal',
          fontSize: '20px',
          lineHeight: '130%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
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
  const [modalIsOpen, setIsOpen] = useState(false);

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
        document.location.href = '/createProfile';
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

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div style={{ width: "100vw", height: "100vh"}}>
      <div style={{backgroundImage: `url(${loginBackground})`, height: "100%",  backgroundRepeat : "no-repeat", backgroundSize : "cover"}}>
        <div style={{display: "flex", justifyContent: "space-between", padding: "50px 50px 0 50px", alignItems: "center"}}>
          <div style={{fontSize: "60px", fontWeight: "bold", color: "white"}}>센티미터</div>

          {Kakao.Auth.getAccessToken() ? <div><Logout logout={logout}/></div> : <div
            onClick={() => {Kakao.Auth.getAccessToken() ? document.location.href = '/createProfile' : openModal()}}
            style={{backgroundColor: "dodgerblue", width: "200px", height: "60px", borderRadius: "10px", color: "white", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center"}}>
            서비스 시작
          </div>}
        </div>

        {modalIsOpen &&
          <div>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={{
                overlay: {
                  backgroundColor: "rgba(0,0,0,0.6)",
                },
                content: {
                  top: '50%',
                  left: '50%',
                  right: 'auto',
                  bottom: 'auto',
                  transform: 'translate(-50%, -50%)',
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  padding: "0 20px",
                  borderRadius: "20px",
                  border: "none"
                },
              }}
              contentLabel="Example Modal"
            >
              <div style={{marginTop: "56px"}}>
                <h2 style={{color: "#939393", fontSize: "18px", display: "flex", justifyContent: "center"}}>Welcome To</h2>
                <h1 style={{color: "#FF6F61", fontSize: "36px"}}>CENTIMETER</h1>
              </div>
              <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "50px"}}>
                <div style={{borderTop: "1px solid #E5E5E5", width: "100px"}} />
                <div style={{color: "#AEAEAE", fontSize: "14px", margin: "0 5px", fontWeight: "normal"}}>아래 소셜계정으로 로그인</div>
                <div style={{borderTop: "1px solid #E5E5E5", width: "100px"}} />
              </div>

              <div style={{marginTop: "25px", marginBottom: "40px"}}>
                {!isLogin ?
                  <div>
                    <LoginWithGoogle  />
                    <LoginWithKakao login={login} />
                    <LoginWithFacebook  />
                  </div> : <></>
                }
              </div>

            </Modal>
          </div>
        }

        {/* 방 만드는 화면으로 바로 이동 */}
        {/*<Top />*/}
      </div>
    </div>
  );
}
