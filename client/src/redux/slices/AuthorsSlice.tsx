import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "../../interfaces/interface";
import axios from "axios";

interface UserState {
  users: User[];
  status: "idle" | "pending" | "fulfilled" | "rejected";
  error: null | string;
}

const initialState: UserState = {
  users: [],
  status: "idle",
  error: null,
};

export const featchUser = createAsyncThunk("users/featchUser", async () => {
  const res = await axios.get("http://localhost:8080/users");
  return res.data;
});

export const addUser = createAsyncThunk("users/addUser", async (user :User) => {
  const res = await axios.post("http://localhost:8080/users", user);
  return res.data;
});


const ProjectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
     .addCase(featchUser.pending,(state) => {
        state.status = "pending"
    })
    .addCase(featchUser.fulfilled,(state,action) => {
        state.status = "fulfilled"
        state.users = action.payload
    })
    .addCase(featchUser.rejected,(state) => {
        state.status = "fulfilled"
        state.error = "Lỗi nhé"
    })
    .addCase(addUser.pending,(state) => {
        state.status = "pending"
    })
    .addCase(addUser.fulfilled,(state,action) => {
        state.status = "fulfilled"
        state.users.push(action.payload)
    })
  },
});

export default ProjectSlice.reducer;
