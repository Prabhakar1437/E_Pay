import React, { useState } from "react";
import { Form, Modal, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { TransferFunds, VerifyAccount } from "../../apicalls/transactions";
import { ShowLoading , HideLoading } from "../../redux/loadersSlice";
import { ReloadUser } from "../../redux/usersSlice";

function TransferFundModal({
    showTransferFundModal,
    setShowTransferFundModal,
    reloadData
}){

    const {user} = useSelector(state => state.users);
    const [isVerified, setIsVerified] = useState("");

    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const verifyAccount = async()=>{
        try {
            dispatch(ShowLoading());
            const response = await VerifyAccount({
                receiver: form.getFieldValue("receiver"),
            })
            dispatch(HideLoading());
            if(response.success){
                setIsVerified("true");
            }
            else{
                setIsVerified("false");
            }
        } catch (error) {
            dispatch(HideLoading());
            setIsVerified("false");
        }
    }

    const onFinish = async(values)=>{
        try {

            if(values.amount > user.balance){
                message.error("Kaha se aayenge itne paise!");
                return;
            }
            
            dispatch(ShowLoading());
            const payload = {
                ...values,
                sender : user._id,
                status: "Success",
                reference : values.reference || "No Reference",
            };
            const response = await TransferFunds(payload);
            dispatch(HideLoading());
            if(response.success){
                reloadData();
                setShowTransferFundModal(false);
                message.success(response.message);
                dispatch(ReloadUser(true));
            }
            else{
                message.error(response.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }

    return (
        <div>
            <Modal
                title= "Transfer Funds"
                open= {showTransferFundModal}
                onCancel = {()=> setShowTransferFundModal(false)}
                footer={null}
                >

                <Form layout="vertical" form={form} 
                    onFinish={onFinish}>
                    <div className="flex gap-2 items-center">
                        <Form.Item label="Account Number" name="receiver" className="w-100">
                            <input type="text"/>
                        </Form.Item>
                        <button className="primary-contained-btn mt-1" type="button"
                            onClick={verifyAccount} >
                            VERIFY
                        </button>
                    </div>

                    {isVerified === "true" && <div className="success-bg">
                        Verified
                    </div>}

                    {isVerified === "false" && <div className="error-bg">
                        Invalid Account
                    </div>}

                    <Form.Item label="Amount" name="amount"
                        rules={[
                            {
                                required: true,
                                message: "Please input the amount!"
                            },
                            {
                                max: user.balance,
                                message: "Insufficient Balance"
                            }
                        ]}>
                        <input type="text"/>
                    </Form.Item>

                    <Form.Item label="Reference" name="reference">
                        <textarea type="text"/>
                    </Form.Item>

                    <div className="flex justify-end gap-1">
                        <button className="primary-outlined-btn" onClick={() => setShowTransferFundModal(false)}>Cancel</button>
                        { isVerified==="true"  && <button className="primary-contained-btn">Transfer</button> }
                    </div>

                </Form>

            </Modal>
        </div>
    )
};

export default TransferFundModal;