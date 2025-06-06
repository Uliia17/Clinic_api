import {createAsyncThunk, createSlice, isFulfilled, isRejected} from "@reduxjs/toolkit";
import {authService} from "../../services/authService";
import {IAuth} from "../../interfaces/authInterface";
import {IDoctor} from "../../interfaces/doctorInterface";

interface IState {
    me: IDoctor | null;
    error: boolean | null;
}

const initialState: IState = {
    me: null,
    error: null
}


const login = createAsyncThunk<IDoctor, { doctor: IAuth }>(
    'authSlice/login',
    async ({doctor}, {rejectWithValue}) => {
        try {
            return await authService.login(doctor)
        } catch (e) {
            return rejectWithValue(e)
        }

    }
)
const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.me = action.payload
            })
            .addMatcher(isRejected(login), state => {
                state.error = true
            })
            .addMatcher(isFulfilled(login), state => {
                state.error = false
            })
});

const {reducer: authReducer, actions} = authSlice;

const authActions = {
    ...actions,
    login
}

export {
    authReducer,
    authActions
}