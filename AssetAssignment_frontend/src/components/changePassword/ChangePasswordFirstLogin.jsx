import React, {useEffect, useState} from "react";
import {Modal, Input, Button, Form} from "antd";
import {EyeOutlined, EyeInvisibleOutlined} from "@ant-design/icons";
import axios from "axios";
import "antd/dist/antd.css";
import "../changePassword/ChangePasswordForm.css";
import toast, { Toaster } from 'react-hot-toast';

export default function ChangePasswordFirstLogin(props) {
    const config = {
        headers: { Authorization: `Bearer ${props.token}` }
    };
    const formItemLayout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 16,
            offset: 1,
        },
    };
    const [isPaswordVisible, setIsPaswordVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(props.isOpen);
    const [changeSuccess, setChangeSuccess] = useState(false);
    const [Footer, setFooter] = useState({});
    const [error, setError] = useState("");
    const [Loading, setLoading] = useState({
        isLoading: false
    })
    const [password, setPassword] = useState({
        old_password: "",
        new_password: "",
    });
    
    useEffect(() => {
        setFooter({
            footer: (
                <Button
                    disabled={false}
                    className="buttonSaveChangePassword1st"
                     loading={Loading.isLoading} key="submit"
                    onClick={() => {
                        setLoading({...Loading, isLoading: true});
                        setTimeout(() => {
                            setLoading({...Loading, isLoading: false})
                        }, 2000)
                        axios
                        // .put(`${process.env.CHANGEPASSWORD_USERURL}`+ props.idAccount, password,config)
                        .put("https://asset-assignment-be.azurewebsites.net/api/account/"+  props.idAccount, password,config)
                        .then(function (response) {
                            
                            let loginState = JSON.parse(localStorage.getItem('loginState'));
                            localStorage.setItem(
                                "loginState",
                                JSON.stringify({
                                    token: loginState.token,
                                    isLogin: true,
                                    role: loginState.roles,
                                    username: loginState.username,
                                    isfirstlogin: false,
                                    id: loginState.id,
                                })
                            );
                            setChangeSuccess(true);
                            setFooter({
                                footer: (
                                    <Button
                                        className = "buttonSaveChangePassword"
                                        onClick={() => {
                                            setFooter({});
                                            setChangeSuccess(false);
                                            setIsModalVisible(false);
                                        }}
                                    >
                                        Close
                                    </Button>
                                ),
                            });
                        })
                        .catch((error) => {
                            // toast.error(error.response.data.message);
                            if(error.response.data.message == "Password not changed"){
                                setError("New password must be difference old password");
                            }else{
                            setError("Password must have uppercase, number, no blank, special character, length between 8 and 15");
                            }
                            console.log(error.response.data.message)
                            
                        });
                    }}>
                    Save
                </Button>
            )
        });
    },[password])
    return (
        <>
            <Modal
                style={{positon: 'absolute', top: 200, right: -170}}
                title="Change Password"
                visible={isModalVisible}
                maskClosable={false}
                
                closable={false}
                {...Footer}
            >
            {changeSuccess === false ? (<>
                <p id="titleChangePassword1st">
                    This is first time you logged in <br />
                    You have to change your password to continue.
                </p>
                <Form {...formItemLayout}>
                <Form.Item 
                    
                            name="newPassword1st"
                            label="New password"
                        >
                    <Input.Password
                        type={isPaswordVisible ? "text" : "password"}
                        onChange={(newPass) => {
                                    setPassword({
                                        ...password,
                                        new_password: newPass.target.value,

                                    });
                                    setError("");
                                    // setNotEmpty(newPass.target.value != " " ? false : true);
                                }}
                        suffix={
                            isPaswordVisible ? (
                                <EyeOutlined
                                    onClick={() => {
                                        setIsPaswordVisible(!isPaswordVisible);
                                    }}
                                />
                            ) : (
                                <EyeInvisibleOutlined
                                    onClick={() => {
                                        setIsPaswordVisible(!isPaswordVisible);
                                    }}
                                />
                            )
                        }
                    />
                </Form.Item>
                <Form.Item
                hidden={error != "" ? false : true}
                        style={{marginLeft: 125,color: "red"}}
                         >
                        {error}
                        </Form.Item>
                </Form>
                </>) : (
                    <p>Your password has been changed successfully!</p>
                )}
            </Modal>

        </>
    )
 }