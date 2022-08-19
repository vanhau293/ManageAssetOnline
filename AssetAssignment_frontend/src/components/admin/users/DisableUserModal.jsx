import { Button, Modal } from "antd";
import React from "react";
import { useState } from "react";
import "../Modal.css"
import axios from "axios";

import toast, { Toaster } from 'react-hot-toast';
export default function DisableUserModal(props){
    const loginState = JSON.parse(localStorage.getItem("loginState"));
    const [modal, setModal] = useState({
        isOpen: true,
        isLoading: false,
    });
    const config = {
        headers: { Authorization: `Bearer ${loginState.token}` }
    };
    const [id, setId] = useState(props.id);
    const handleDisable = () => {
        console.log(props.id);
        axios.delete(`https://asset-assignment-be.azurewebsites.net/api/account/`+id, config)
            .then(
           (response) => {
            setModal({ ...modal, isOpen: false })
            toast.success(response.data.message);
            window.location.reload();
            }).catch((error) => {
                toast.error(error.response.data.message);
            })
        }
    
    
    return (
        <>
        <Modal
        className = "modalConfirm"
                title="Are you sure?"
                visible={modal.isOpen}
                width={400}
                closable={false}
                onOk={handleDisable}
                onCancel = {()=> {setModal({ ...modal, isOpen: false });
                                        props.setIsOpen();
            }}
                footer={[
                    <Button key="submit" className="buttonSave" onClick={handleDisable}>
                     Disable
                    </Button>,
                    <Button key="cancel" className = "buttonCancel" onClick={()=> {setModal({ ...modal, isOpen: false });
                    props.setIsOpen();}}>
                      Cancel
                    </Button>
                  ]}
                
            >
                <p>Do you want to disable this user?</p>
                <br/>
            </Modal>
            <Toaster
            toastOptions={{
                className: 'toast',
                style: {
                    border: '1px solid #713200',
                    padding: '36px',
                    color: '#713200',
                    
                },
            }}
        />
        </>
    );
}