import {createSlice} from '@reduxjs/toolkit';

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    nickname: null,
    characterId: null,
  },
  reducers: {
    setAccount(state, action) {
      const {nickname, characterId} = action.payload
      // return {...state, nickname:nickname, characterId:characterId}
      state.nickname = nickname;
      state.characterId = characterId;
    }
  }
})

export const {setAccount} = accountSlice.actions

export default accountSlice.reducer
