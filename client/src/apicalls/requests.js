import { axiosInstance } from ".";

// get all requests for user

export const GetAllRequests = async(payload)=>{
    try {
        const {data} = await axiosInstance.post("/api/requests/get-all-requests",payload);
        return data;
    } catch (error) {
        return error.response.data;   
    }
}


// send a request to another user

export const SendRequest = async(payload)=>{
    try {
        const {data} = await axiosInstance.post("/api/requests/send-request",payload);
        return data;
    } catch (error) {
        return error.response.data;   
    }
}


// update request status

export const UpdateRequestStatus = async(payload)=>{
    try {
        const {data} = await axiosInstance.post("/api/requests/update-request-status",payload);
        return data;
    } catch (error) {
        return error.response.data;   
    }
}