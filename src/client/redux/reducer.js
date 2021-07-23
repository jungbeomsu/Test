import {
  SET_USER_DATA
} from "./actionType";

const initialState = {
  userData: {
    nickname: null,
    characterId: null,
  }
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state, userData: action.userData
      }

    default:
      return state;
  }
}
