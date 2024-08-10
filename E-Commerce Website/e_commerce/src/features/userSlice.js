import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userName:"",
}

export const userSlice = createSlice({
  name: 'UserData',
  initialState,
  reducers: {
    UserName:(state,actions)=>{
        state.userName = actions.payload.FirstName
    }
  },
})

export const { UserName } = userSlice.actions

export default userSlice.reducer