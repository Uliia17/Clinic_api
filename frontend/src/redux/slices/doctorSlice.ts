import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {IDoctor} from "../../interfaces/doctorInterface";
import {doctorService} from "../../services/doctorService";

interface IState{
    doctors:IDoctor[]
}

const initialState:IState = {
    doctors:[]
}

const getAll = createAsyncThunk<IDoctor[], void>(
    'doctorSlice/getAll',
    async (_, {rejectWithValue})=>{
        try {
            const {data} = await doctorService.getAll();
            return data
        }catch (e){
            return rejectWithValue(e)
        }
    }
);
const create = createAsyncThunk<IDoctor, {doctor: IDoctor }>(
    'doctorSlice/create',
    async ({doctor}, {rejectWithValue})=>{
        try {
            const {data} = await doctorService.create(doctor);
            return data
        }catch (e){
            return rejectWithValue(e)
        }
    }
);
const doctorSlice = createSlice({
    name:'doctorSlice',
    initialState,
    reducers:{},
    extraReducers:builder =>
        builder
            .addCase(getAll.fulfilled, (state, action) => {
                state.doctors =action.payload
            })
});