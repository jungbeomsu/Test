import {createSlice} from '@reduxjs/toolkit';

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    accountId: null,
    accountType: null,
    characterId: null,
    userId: null,
    nickname: null,
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
    }
  }
})

export const {setProfile, setUserId} = accountSlice.actions

export default accountSlice.reducer
