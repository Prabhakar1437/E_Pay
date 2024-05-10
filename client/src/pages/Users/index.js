import React, { useEffect, useState } from "react";
import {Table, message} from "antd";
import {useDispatch} from "react-redux";
import { GetAllUsers, UpdateVerifiedStatus } from "../../apicalls/users";
import { ShowLoading , HideLoading } from "../../redux/loadersSlice";
import PageTitle from "../../components/PageTitle";

function Users(){
    const [users,setUsers] = useState([]);

    const dispatch = useDispatch();

    const getData = async() =>{
        try {
            dispatch(ShowLoading());
            const response = await GetAllUsers();
            dispatch(HideLoading());
            if(response.success){
                setUsers(response.data);
            }
            else{
                message.error(response.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }

    const updateStatus = async(record,isVerified)=>{
        try {
            dispatch(ShowLoading());
            const response = await UpdateVerifiedStatus({
                selectedUser: record._id,
                isVerified
            });
            dispatch(HideLoading());
            if(response.success){
                message.success(response.message);
                getData();
            }
            else{
                message.error(response.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }

    const columns = [
        {
            title: "First Name",
            dataIndex: "firstName"
        },
        {
            title: "Last Name",
            dataIndex: "lastName"
        },
        {
            title: "Email",
            dataIndex: "email"
        },
        {
            title: "Phone",
            dataIndex: "phoneNumber"
        },
        {
            title: "Verified",
            dataIndex: "isVerified",
            render : (text,record)=>{
                return text ? "Yes" : "No";
            }
        },
        {
            title: "Action",
            dataIndex: "action",
            render : (text,record)=>{
                return <div className="flex gap-1">
                    {record.isVerified ? 
                        (<button className="primary-outlined-btn"
                            onClick={()=>updateStatus(record,false)}>Suspend</button>) : 
                        (<button className="primary-outlined-btn"
                            onClick={()=>updateStatus(record,true)}>Activate</button>) 
                    }
                </div>
            }
        }
    ];

    useEffect(()=>{
        getData();
    } , []);

    return (
        <div>
            <PageTitle title="Users"/>
            <Table columns={columns} dataSource={users} className="mt-2"/>
        </div>
    )
}

export default Users;