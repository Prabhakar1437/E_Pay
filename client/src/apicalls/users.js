import { axiosInstance } from ".";


// Login User

export const LoginUser = async(payload)=>{
    try {
        const {data} = await axiosInstance.post("/api/users/login",payload);
        return data;
    } catch (error) {
        return error.response.data;   
    }
}


// Register User

export const RegisterUser = async(payload)=>{
    try {
        const {data} = await axiosInstance.post("/api/users/register",payload);
        return data;
    } catch (error) {
        return error.response.data;   
    }
}


// Get user info

export const GetUserInfo = async(payload)=>{
    try {
        const {data} = await axiosInstance.post("/api/users/get-user-info",payload);
        return data;
    } catch (error) {
        return error.response.data;   
    }
}


// Get all users

export const GetAllUsers = async(payload)=>{
    try {
        const {data} = await axiosInstance.post("/api/users/get-all-users",payload);
        return data;
    } catch (error) {
        return error.response.data;   
    }
}


// Update user verified status

export const UpdateVerifiedStatus = async(payload)=>{
    try {
        const {data} = await axiosInstance.post("/api/users/update-user-verified-status",payload);
        return data;
    } catch (error) {
        return error.response.data;   
    }
}