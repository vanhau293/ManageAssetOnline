import {Row, Col, Form, Input, Select, Button, DatePicker, Radio, Cascader} from "antd";
import React, {useEffect, useState} from "react";
import "antd/dist/antd.css";
import "./CreateUser.css";
import axios from "axios";
import moment from 'moment';
import { useNavigate, useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import * as formatDate from "../shared/formatdate"
export default function EditUser() {
    const [isLoading, setLoading] = useState({isLoading: false});
    const idInformation = useParams();
    const [information,setInformation] = useState({
        dateOfBirth: " ",
        firstName: " ",
        gender: " ",
        informationId: " ",
        joinDate: " ",
        lastName: " ",
        locations: " ",
        staffCode: " ",
    });
    const loginState = JSON.parse(localStorage.getItem("loginState"));
    const navigate = useNavigate();
    const {Option} = Select;
    const [form] = Form.useForm();
    const config = {
        headers: { Authorization: `Bearer ${loginState.token}` }
    };
    const formItemLayout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 18,
            offset: 1,
        },
    };
    useEffect(() => {
        axios
            // .get(`http://localhost:8080/api/information?accountid=` + idInformation.id, config)
            .get(`https://asset-assignment-be.azurewebsites.net/api/information?accountid=` + idInformation.id, config)
            .then((response) => {
                // console.log(response.data);
                // const dateOfBirth = formatDate.FormatDate(response.data.dateOfBirth);
                // const joinedDate = formatDate.FormatDate(response.data.joinDate);
                setInformation(response.data);
                form.setFieldsValue({
                    Firstname: response.data.firstName,
                    Lastname: response.data.lastName,
                    DateOfBirth: moment(response.data.dateOfBirth,'DD/MM/YYYY'),
                    Gender: response.data.gender.toLowerCase(),
                    JoinedDate: moment(response.data.joinedDate,'DD/MM/YYYY'),
                    Department: (response.data.staffCode).indexOf("SD") != -1 ? "SD" : "BPS",
                    Type: response.data.roleId == 1 ? "Admin" : "Staff" 

                });
                console.log(response.data)

            })
            .catch((error) => {
                toast.error("Load information failed");
            });
    },[])
    // console.log(information);
    
    const onFinish = (fieldsValue) => {
        // console.log(fieldsValue);
        const values = {
            ...fieldsValue,
            DateOfBirth: fieldsValue["DateOfBirth"].format("DD/MM/YYYY"),
            JoinedDate: fieldsValue["JoinedDate"].format("DD/MM/YYYY"),
        };

        const data = {
            // informationId: information.informationId,
                firstName: information.firstName,
                lastName: information.lastName,
                joinedDate: values.JoinedDate,
                roleId: values.Type == 1 || values.Type== "Admin" ? 1 : 2,
                dateOfBirth: values.DateOfBirth,
                gender: values.Gender,
                staffCode: information.staffCode,
                locations: information.locations,
                roleName: ""
        }
        console.log(data);
        axios
            // .put(`http://localhost:8080/api/information/` + information.informationId, data, config)
            .put(`https://asset-assignment-be.azurewebsites.net/api/information/` + information.informationId, data, config)
            .then((response) => {
                setTimeout(() => {
                    setLoading({isLoading: false});
                }, 2000)

                console.log(response.data);
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        ...response.data,
                    })
                );
                toast.success("Edit user successfully");
                navigate("/user");

            })
            .catch((error) => {
                // toast.error("Edit user failed");
                console.log(error)
                // console.log(error.response.data.message);
            });
     };
      
    return (
        <Row>
            <Col span={12} offset={6}>
                <div className="content">
                    <Row  className="fontHeaderContent EditUserTitle">
                        Edit User
                    </Row>
                    <Row className="formCreate"
                        
                    >
                        <Form
                            form={form}
                            // initialValues={{Gender: 'Female'}}
                            name="EditUserForm"
                            onFinish={onFinish}
                            {...formItemLayout}
                            labelAlign="left"
                        >
                                <Form.Item label="First name"
                                    name="Firstname"
                                    rules={[{required: true, message: 'First name must be required'},
                                        {
                                            pattern: new RegExp("^[a-zA-Z'. ]+$"),
                                            message: 'First name can not have number'
                                        }
                                        , {max: 50, message: "First name must less than 50 characters"}
                                    ]}
                                >
                                    <Input disabled={true} maxLength={51} value={information.firstName != " " ? information.firstName : ""}
                                           className="inputForm"/>
                                </Form.Item>

                            <Form.Item label="Last name" 
                                    name="Lastname"
                                    rules={[{required: true, message: 'Last name must be required'},
                                        {
                                            pattern: new RegExp("^[a-zA-Z'. ]+$"),
                                            message: 'Last name can not have number'
                                        }
                                        , {max: 50, message: "Last name must less than 50 characters"}
                                    ]}
                                >
                                    <Input disabled={true} maxLength={51}
                                           className="inputForm"/>
                            </Form.Item>
                            <Form.Item label="Date of Birth" 
                                    name="DateOfBirth"
                                    rules={[{required: true, message: 'Date of birth must be required'},
                                    () => ({
                                        validator(_, value) {
                                            if (value === null || value === "") {
                                                return Promise.resolve()
                                            }
                                            if ((new Date() - value._d) < 0) {
                                                return Promise.reject("User not born yet. Please select a different date")
                                            }
                                            else if ((new Date().getFullYear() - value._d.getFullYear()) < 18
                                                & (new Date() - value._d) >= 0) {
                                                    return Promise.reject("User is under 18. Please select a different date")
                                                }
                                            else if (value._d.getFullYear() < 1950){
                                                return Promise.reject("Can only select the date from 1950 or later. Please select a different date")
                                            }
                                            else return Promise.resolve();
                                        }
                                    })
                                    ]}
                                    
                                >
                                    <DatePicker
                                        disabled={isLoading.isLoading === true}
                                        format="DD/MM/YYYY"
                                        className="inputForm"
                                        popupStyle={{width: "26.5%", textAlign: "center"}}
                                    />

                            </Form.Item>
                            <Form.Item disabled={isLoading.isLoading === true} label="Gender" name="Gender" rules={[{required: true, message: 'Gender must be required'}]}>
                                    <Radio.Group disabled={isLoading.isLoading === true}>
                                        <Radio value="female">Female</Radio>
                                        <Radio value="male">Male</Radio>
                                    </Radio.Group>
                            </Form.Item>
                            <Form.Item label="Joined Date"
                                    name="JoinedDate"
                                    rules={[{required: true, message: 'Joined date must be required',},
                                        ({getFieldValue}) => ({
                                            validator(_, value) {

                                                if (value === null || value === "") {
                                                    return Promise.resolve()
                                                }
                                                if (value._d.getDay() === 0 || value._d.getDay() === 6) {

                                                    return Promise.reject(`Joined date is Saturday or Sunday. Please select a different date `);

                                                } else if (value - getFieldValue('DateOfBirth') < 0) {

                                                    return Promise.reject("Joined date is not later than Date of Birth. Please select a different date");
                                                }  
                                                else if (value - getFieldValue('DateOfBirth') <= 568080000000
                                                & value - getFieldValue('DateOfBirth') >= 0) {

                                                    return Promise.reject("User is under 18 when join. Please select a different date");
                                                } 
                                                else if ((new Date() - value._d) < 0) {
                                                    return Promise.reject("User has not joined. Please select a different date")
                                                }
                                                 else {
                                                    return Promise.resolve()
                                                }
                                            }
                                        })
                                       
                                    ]}
                                >

                                    <DatePicker
                                        disabled={isLoading.isLoading === true}
                                        format="DD/MM/YYYY"

                                        className="inputForm"
                                        popupStyle={{width: "26.5%", textAlign: "center"}}

                                    />

                            </Form.Item>
                            <Form.Item label="Department"
                                    name="Department"
                                    rules={[{required: true, message: 'Type must be required'}]}
                                    // style={{display: "block"}}
                                >
                                    <Select
                                        disabled={true}
                                        showSearch
                                        className="inputForm"
                                        style={{display: "block"}}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                        filterSort={(optionA, optionB) =>
                                            optionA.children
                                                .toLowerCase()
                                                .localeCompare(optionB.children.toLowerCase())
                                        }
                                    >
                                        <Option value="BPS">Business Process Solution</Option>
                                        <Option value="SD">Software Development</Option>
                                    </Select>
                            </Form.Item>
                            <Form.Item label="Type"
                                    name="Type"
                                    rules={[{required: true, message: 'Type must be required'}]}
                                >
                                    <Select
                                        disabled={isLoading.isLoading === true}
                                        showSearch
                                        className="inputForm"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                        filterSort={(optionA, optionB) =>
                                            optionA.children
                                                .toLowerCase()
                                                .localeCompare(optionB.children.toLowerCase())
                                        }
                                    >
                                        <Option value="1">Admin</Option>
                                        <Option value="2">Staff</Option>
                                    </Select>
                            </Form.Item>
                            

                            <Form.Item shouldUpdate >
                                {() => (
                                <Row style={{float: 'right'}}>
                                        <Button
                                            disabled={
                                                !form.isFieldsTouched(true) ||
                                                form.getFieldsError().filter(({errors}) => errors.length).length > 0
                                            }
                                            className="buttonSave"
                                            style={{background: "#e30c18", color: "white"}}
                                            loading={isLoading.isLoading} htmlType="submit" onClick={() => {
                                            setLoading({isLoading: true})
                                            setTimeout(() => {
                                                    setLoading({isLoading: false})
                                                }, 2000
                                            )
                                        }}
                                        >
                                            Save
                                        </Button>
                                    <Button
                                        className="buttonCancel"
                                        disabled={isLoading.isLoading === true} onClick={() => {
                                        navigate("/user");
                                    }}>
                                        Cancel
                                    </Button>

                                </Row>

                                )}
                            </Form.Item>
                        </Form>
                    </Row>
                </div>
            </Col>
        </Row>
    );
}
