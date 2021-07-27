import {createSlice} from '@reduxjs/toolkit';

const roomInfoSlice = createSlice({
  name: 'roomInfo',
  initialState: {
    roomname: null,
    password: null,
    presetId: null,
  },
  reducers: {
    setRoomInfo(state, action) {
      const {roomname, password, presetId} = action.payload
      state.roomname = roomname;
      state.password = password;
      state.presetId = presetId;
    }
  }
})

export const {setRoomInfo} = roomInfoSlice.actions

export default roomInfoSlice.reducer
