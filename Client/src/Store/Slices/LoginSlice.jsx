import { createSlice } from '@reduxjs/toolkit'



export const LoginDataSlice = createSlice({
    name: 'LoginData',
    initialState: {
        User: null
    },
    reducers: {
        LoginDataR: (state, action) => {
            state.User = action.payload;
            console.log(action.payload);
        }
    }
})

export const {LoginDataR} = LoginDataSlice.actions
export default LoginDataSlice.reducer