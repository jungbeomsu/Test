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
    setAccount(state, action) {
      const {accountId, accountType, characterId, userId, nickname} = action.payload
      state.accountId = accountId;
      state.accountType = accountType;
      state.characterId = characterId;
      state.userId = userId;
      state.nickname = nickname;
    }
  }
})

export const {setAccount} = accountSlice.actions

export default accountSlice.reducer
