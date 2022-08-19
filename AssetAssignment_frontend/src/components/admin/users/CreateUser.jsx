import {Row, Col, Form, Input, Select, Button, DatePicker, Radio, Cascader} from "antd";
import React, {useState} from "react";
import "antd/dist/antd.css";
import "./CreateUser.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import toast from 'react-hot-toast';
export default function CreateUser() {
    const [isLoading, setLoading] = useState({isLoading: false});
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
    const onFinish = (fieldsValue) => {
        let values = {
            ...fieldsValue,
            DateOfBirth: fieldsValue["DateOfBirth"].format("DD/MM/YYYY"),
            JoinedDate: fieldsValue["JoinedDate"].format("DD/MM/YYYY"),
        };
        if(values.Type[1]===undefined){
            values = {
                ...values,
                Type: [ values.Type[0], 'HCM']
            }
        }

        axios
            .post(`https://asset-assignment-be.azurewebsites.net/api/account`, {
                firstName: values.Firstname.trim(),
                lastName: values.Lastname.trim(),
                join: values.JoinedDate,
                roleName: values.Type[0],
                birth: values.DateOfBirth,
                gender: values.Gender,
                prefix: values.Department,
                locations: values.Type[1]
            }, config)
            .then((response) => {
                setTimeout(() => {
                    setLoading({isLoading: false});
                }, 2000)

                console.log(response.data);
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        ...response.data
                    })
                );
                toast.success("Create new user successfully");
                navigate("/user");

            })
            .catch((error) => {
                toast.error("Create new user failed");
                console.log(error)
                console.log(error.response.data.message);
            });
     };

    const options = [
        {
          value: 'admin',
          label: 'Admin',
          children: [
            {
              value: 'HCM',
              label: 'Ho Chi Minh',
              
            },
            {
                value: 'DN',
                label: 'Da Nang',
            },
            {
                value: 'HN',
                label: 'Ha Noi',
            },
          ],
        },
        {
          value: 'staff',
          label: 'Staff',
        },
      ];
      
    return (
        <Row>
            <Col span={12} offset={6}>
                <div className="content">
                    <Row  className="fontHeaderContent">
                        Create New User
                    </Row>
                    <Row className="formCreate"
                        
                    >
                        <Form
                            form={form}
                            // initialValues={{Gender: 'Female'}}
                            
                            name="complex-form"
                            onFinish={onFinish}
                            {...formItemLayout}
                            labelAlign="left"
                            initialValues={{
                                Department: 'SD',
                                Type: ['staff']
                              }}
                        >
                            <Form.Item className="labelCreate" label="First name" >
                                <Form.Item
                                    name="Firstname"
                                    rules={[
                                        {
                                            pattern: new RegExp("^[a-zA-Z'. ]+$"),
                                            message: 'First name is not allowed to contain number or special characters'
                                        }
                                        , {max: 128, message: "First name must be less than 128 characters"},
                                        () => ({
                                            validator(_, value) {
                                                if ((value.trim())==='') {
                                                    return Promise.reject("First name must be required")
                                                }
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}
                                    hasFeedback
                                >
                                    <Input disabled={isLoading.isLoading === true} maxLength={129}
                                           className="inputForm"/>
                                </Form.Item>
                            </Form.Item>

                            <Form.Item label="Last name" >
                                <Form.Item
                                    name="Lastname"
                                    rules={[() => ({
                                        validator(_, value) {
                                            if ((value.trim())==='') {
                                                return Promise.reject("Last name must be required")
                                            }
                                            return Promise.resolve();
                                        }
                                    }),
                                        {
                                            pattern: new RegExp("^[a-zA-Z'. ]+$"),
                                            message: 'Last name is not allowed to contain number or special characters'
                                        }
                                        , {max: 128, message: "Last name must be less than 128 characters"}
                                    ]}
                                    hasFeedback
                                >
                                    <Input disabled={isLoading.isLoading === true} maxLength={129}
                                           className="inputForm"/>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="Date of Birth" >
                                <Form.Item
                                    name="DateOfBirth"
                                    rules={[ {required: true, message: 'Date of birth must be required',},
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
                                    hasFeedback
                                >
                                    <DatePicker
                                        disabled={isLoading.isLoading === true}
                                        format="DD/MM/YYYY"
                                        className="inputForm"
                                    />

                                </Form.Item>
                            </Form.Item>
                            <Form.Item disabled={isLoading.isLoading === true} label="Gender" >
                                <Form.Item name="Gender" rules={[{required: true, message: 'Gender must be required'}]}>
                                    <Radio.Group disabled={isLoading.isLoading === true}>
                                        <Radio value="Female">Female</Radio>
                                        <Radio value="Male">Male</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="Joined Date" >
                                <Form.Item
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
                                                else if (value - getFieldValue('DateOfBirth') <= 568080000000) {

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
                                    hasFeedback
                                >

                                    <DatePicker
                                        disabled={isLoading.isLoading === true}
                                        format="DD/MM/YYYY"

                                        className="inputForm"

                                    />

                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="Department">
                                <Form.Item
                                    name="Department"
                                    rules={[{required: true, message: 'Type must be required'}]}
                                    
                                    hasFeedback
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
                                        defaultValue="SD"
                                    >
                                        <Option value="BPS">Business Process Solution</Option>
                                        <Option value="SD">Software Development</Option>
                                    </Select>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="Type">
                                <Form.Item
                                    name="Type"
                                    rules={[{required: true, message: 'Type must be required'}]}
                                    hasFeedback
                                >
                                    <Cascader
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
                                
                                        options={options}
                                        
                                    
                                        
                                    />
                                </Form.Item>
                            </Form.Item>
                            

                            <Form.Item shouldUpdate >
                                {() => (
                                <Row style={{float: 'right'}}>
                                        < Button
                                            disabled={
                                                !form.isFieldTouched("Firstname") || !form.isFieldTouched("Lastname")
                                                || !form.isFieldTouched("DateOfBirth") || !form.isFieldTouched("JoinedDate") || !form.isFieldTouched("Gender")
                                                ||form.getFieldsError().filter(({errors}) => errors.length).length > 0
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
