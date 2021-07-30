import {createSlice} from '@reduxjs/toolkit';

const commonSlice = createSlice({
  name: 'common',
  initialState: {
    accountId: null,
    accountType: null,
    characterId: null,
    userId: null,
    nickname: null,
    roomId: null,
  },
  reducers: {
    setProfile(state, action) {
      const {accountId, accountType, characterId, userId, nickname} = action.payload
      state.accountId = accountId;
      state.accountType = accountType;
      state.characterId = characterId;
      state.userId = userId;
      state.nickname = nickname;
    },
    setUserId(state, action) {
      state.userId = action.payload;
    },
    setRoomId(state, action) {
      state.roomId = action.payload;
    }
  }
})

export const {setProfile, setUserId, setRoomId} = commonSlice.actions

export default commonSlice.reducer
