import { configureStore } from "@reduxjs/toolkit";
import AuthorSlice from '../slices/AuthorsSlice'
import ProjectSlice from '../slices/ProjectSlice'
import TaskSlice from '../slices/TaskSlice'

const stores = configureStore({
    reducer: {
        users : AuthorSlice,
        projects : ProjectSlice,
        tasks : TaskSlice
    }
})

export default stores
export type RootState = ReturnType<typeof stores.getState>;
export type AppDispatch = typeof stores.dispatch;