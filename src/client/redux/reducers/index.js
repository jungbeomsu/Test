import { combineReducers } from '@reduxjs/toolkit'
import accountReducer from '../features/account/accountSlice'
import roomInfoReducer from "../features/room/roomInfoSlice";

const rootReducer = combineReducers({
  // 상태관리는 리덕스 툴킷 사용한다
  // => 구조 단순, 사용하기 편함, immer 및 deveTools 제공, 미들웨어 내장
  // 기능 하나 추가를 위해 actionType, actionFunction, reducer 전부 작성해야 하는 기존 리덕스와 달리
  // features 폴더 하위에 각 기능별로 slice를 만들어 rootReducer에 추가해주면 된다 (accountSlice 참고)
  // 사용법은 기존의 리덕스와 같다 dispatch 해서 state를 변경하고 useSlector로 조회하고
  account: accountReducer,
  roomInfo: roomInfoReducer,
})

export default rootReducer;
