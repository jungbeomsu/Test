import React, {useState} from 'react';
import {facebookIcon, googleIcon, kakaoIcon, loginBackground} from "../resources/images";
import './Homepage.css';
import Modal from "react-modal";
import {useHistory} from "react-router-dom";
import api from "../api/api";

import CentiToken from "../api/CentiToken";
import {useDispatch, useSelector} from "react-redux";
import {setUserId} from "../redux/features/common/commonSlice";

const {Kakao} = window;

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
        {facebookIcon}
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
  const [modalIsOpen, setIsOpen] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const userId = useSelector(({common: {userId}}) => userId)

  const login = () => {
    Kakao.Auth.login({
      success: async function (authObj) {
        console.log('access_token: ', authObj.access_token, 'refresh_token: ', authObj.refresh_token);
        const userId = await api.login('KAKAO', authObj.access_token);
        dispatch(setUserId(userId));
        history.push({pathname: '/createProfile'});
      },
      fail: function (e) {
        console.log(JSON.stringify(e))
      },
    })
  }

  const logout = () => {
    CentiToken.remove();
    Kakao.Auth.logout();
    dispatch(setUserId(null));
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div style={{width: "100vw", height: "100vh"}}>
      <div style={{
        backgroundImage: `url(${loginBackground})`,
        height: "100%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}>
        <div
          style={{display: "flex", justifyContent: "space-between", padding: "50px 50px 0 50px", alignItems: "center"}}>
          <div style={{fontSize: "60px", fontWeight: "bold", color: "white"}}>센티미터</div>
          {
            userId ?
              <div>
                <Logout logout={logout}/>
              </div>
              :
              <div
                onClick={openModal}
                style={{
                  backgroundColor: "dodgerblue",
                  width: "200px",
                  height: "60px",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                서비스 시작
              </div>
          }
        </div>
        {
          modalIsOpen &&
          <div>
            <Modal
              isOpen={modalIsOpen}
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
                <h2 style={{color: "#939393", fontSize: "18px", display: "flex", justifyContent: "center"}}>Welcome
                  To</h2>
                <h1 style={{color: "#FF6F61", fontSize: "36px"}}>CENTIMETER</h1>
              </div>
              <div style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "50px"
              }}>
                <div style={{borderTop: "1px solid #E5E5E5", width: "100px"}}/>
                <div style={{color: "#AEAEAE", fontSize: "14px", margin: "0 5px", fontWeight: "normal"}}>아래 소셜계정으로 로그인
                </div>
                <div style={{borderTop: "1px solid #E5E5E5", width: "100px"}}/>
              </div>
              <div style={{marginTop: "25px", marginBottom: "40px"}}>
                <div>
                  <LoginWithGoogle/>
                  <LoginWithKakao login={login}/>
                  <LoginWithFacebook/>
                </div>
              </div>
            </Modal>
          </div>
        }
      </div>
    </div>
  );
}
