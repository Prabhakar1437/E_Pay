import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice";
import loadersSlice from "./loadersSlice";

const store = configureStore({
    reducer:{
        users: usersReducer,
        loaders: loadersSlice,
    }
});

export default store;