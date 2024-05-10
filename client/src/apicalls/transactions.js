import { axiosInstance } from ".";


// verify receiver account

export const VerifyAccount = async(payload)=>{
    try {
        const {data} = await axiosInstance.post("/api/transactions/verify-account",payload);
        return data;
    } catch (error) {
        return error.response.data;   
    }
}


// transfer funds

export const TransferFunds = async(payload)=>{
    try {
        const {data} = await axiosInstance.post("/api/transactions/transfer-funds",payload);
        return data;
    } catch (error) {
        return error.response.data;   
    }
}


// get all transactions

export const GetAllTransactions = async(payload)=>{
    try {
        const {data} = await axiosInstance.post("/api/transactions/get-all-transactions",payload);
        return data;
    } catch (error) {
        return error.response.data;   
    }
}


// deposit funds using stripe

export const DepositFunds = async(payload)=>{
    try {
        const {data} = await axiosInstance.post("/api/transactions/deposit-funds",payload);
        return data;
    } catch (error) {
        return error.response.data;   
    }
}