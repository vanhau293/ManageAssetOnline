import React from "react";
import "antd/dist/antd.css";
import "../users/CreateUser.css";
import { useState } from "react";
import {Row, Col, Form, Input, Select, Button, DatePicker, Radio, Divider} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useNavigate,useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { Dropdown, Menu, Space } from 'antd';
import { useRef } from "react";
import moment from 'moment'
import toast, {Toaster} from "react-hot-toast";
import * as formatDate from "../shared/formatdate"
let index = 0;
export default function EditAsset(){


    const [asset,setAsset] = useState({
        Name: " ",
        Category: " ",
        Specification: " ",
        State: " ",
        InstalledDate: " "
    });
    const idAsset = useParams();

    const [isLoading, setLoading] = useState(false);
    const loginState = JSON.parse(localStorage.getItem("loginState"));
    const navigate = useNavigate();

    const[listCategory, setListCategory] = useState([{}]);
    const [load,setLoad] = useState(false);

    const [name, setName] = useState('');


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

    const onNameChange = (event) => {
        setName(event.target.value);
      };

      useEffect(() => {
        axios
            // .get(`http://localhost:8080/api/information?accountid=` + idInformation.id, config)
            .get(`https://asset-assignment-be.azurewebsites.net/api/asset/` + idAsset.id, config)
            .then((response) => {
                // console.log(response.data);
                // const installedDate = formatDate.FormatDate(response.data.installedDate);
                // console.log(formatDate)
                setAsset(response.data);
                form.setFieldsValue({
                    Name: response.data.assetName,
                    Category: response.data.categoryName,
                    Specification: response.data.specification,
                    State: response.data.state,
                    InstalledDate: moment(response.data.installedDate,'DD/MM/YYYY')

                });
            })
            .catch((error) => {
                console.log(error)
                if(error.response.data.statusCode ===404){
                    toast.error("This asset not found");
                }
                else toast.error("Load information failed");
                navigate("/asset")
            });
    },[])


    const save = (fieldsValue)=>{
        

            var values = {
                ...fieldsValue,
                InstalledDate: fieldsValue["InstalledDate"].format("DD/MM/YYYY")
                // 
            }
        // console.log(values)
        axios.put(`https://asset-assignment-be.azurewebsites.net/api/asset/` + idAsset.id,{
            specification: values.Specification,
            installedDate: values.InstalledDate,
            state:values.State,
            assetName:values.Name
            

        } ,config)
        .then((response) =>{
            setTimeout(() => {
                setLoading({isLoading: false});
            }, 2000)
            localStorage.setItem(
                "asset",
                JSON.stringify({
                    ...response.data
                })
            );
            toast.success("Edit asset successfully");
            navigate("/asset");
            console.log(response.data);

        })
        .catch((error) => {
            toast.error("Edit asset failed");
            console.log(error)
            console.log(error.response.data.message);
        });
    }



    const inputNewCategory = () =>{
        <Space id="inputCategory"
        style={{
          padding: '0 18px 4px',
        }}
            >
            <Input.Group compact>
            <Input
                style={{
                width: '70%',
                }}
                enterKeyHint="Category"
            />
            <Input
                style={{
                width: '30%',
                }}
                enterKeyHint="Prefix"

                
            />
            </Input.Group>
        </Space>
    }



    return (<>
        <Row>
            <Col span={12} offset={6}>
                <div className="content">
                    <Row className= "fontHeaderContent">
                        Edit Asset
                    </Row>
                    <Row className="formCreate">
                        <Form
                            form={form}
                            name="editAssetForm"
                            onFinish={save}
                            {...formItemLayout}
                            labelAlign="left"
                        >
                            {/* <Form.Item  > */}
                                <Form.Item className="labelCreate" label="Name"
                                    name="Name"
                                    rules={[
                                        () => ({
                                            validator(_, value) {
                                                if ((value.trim())==='') {
                                                    return Promise.reject("Name must be required")
                                                }
                                                else if(!value.match(new RegExp("^[a-zA-Z'\-|!*\"\\#$%&/()=?»«@£§€{}.;'<>_,^+~ ]+$"))){
                                                    return Promise.reject("Don't allow Unicode UTF-8 characters for this filed")
                                                }
                                                else if ((value.trim().length)>128) {
                                                    return Promise.reject("Name must be less than 128 characters")
                                                }
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}
                                >
                                    <Input disabled={isLoading.isLoading === true}
                                           className="inputForm"/>
                                </Form.Item>
                            {/* </Form.Item> */}

                            {/* <Form.Item > */}
                                <Form.Item label="Category"
                                    name="Category"
                                    rules={[{required: true, message: 'Category must be required'}]}
                                >
                                    <Select
                                        disabled={true}
                                        showSearch
                                        className="inputForm"
                                        optionFilterProp="children"
                                        

                                        // placeholder="Select a category"
                                        dropdownRender={(menu) => (
                                          <>
                                            {menu}
                                            <Divider
                                              style={{
                                                margin: '8px 0',
                                              }}
                                            />
                                            <a  ref={inputNewCategory()} > Add New Category </a>
                                          </>
                                        )}
                                 >


                                        {listCategory.map((item,index) =>(
                                            <Option
                                                value={item.key}
                                                key={item.categoryId}


                                            >{item.name}</Option>
                                        ))};



                                    </Select>
{/* 
                                    <Dropdown
                                    overlay={(
                                        <Menu>
                                            {listCategory.map((item) =>(
                                                <Menu.Item key={item.categoryId} >{item.name}</Menu.Item>
                                            ))}
                                        </Menu>

                                    )}
                                    trigger={['click']}
                                    >
                                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                        Open Dropdown
                                    </a>

                                
                                    </Dropdown>
             */}
                                        
                                   
                                </Form.Item>
                            {/* </Form.Item> */}

                            {/* <Form.Item  
                            > */}
                                <Form.Item label="Specification"
                                    name="Specification"
                                    rules={[
                                        () => ({
                                            validator(_, value) {
                                                if ((value.trim())==='') {
                                                    return Promise.reject("Specification must be required")
                                                }
                                                else if(!value.match(new RegExp("^[a-zA-Z'\n\r\-|!*\"\\#$%&/()=?»«@£§€{}.;'<>_,^+~\t ]+$"))){
                                                    return Promise.reject("Don't allow Unicode UTF-8 characters for this filed")
                                                }
                                                else if ((value.length)>500) {
                                                    return Promise.reject("Specification must be less than 500 characters")
                                                }
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}
                                >

                                <TextArea 
                                          className="largeInput"
                                          rows="5" cols="20" maxLength={501}
                                >

                                </TextArea>
                                </Form.Item>

                            {/* </Form.Item> */}

                            {/* <Form.Item  > */}
                                <Form.Item
                                    name="InstalledDate" label="Installed Date"
                                    rules={[{required: true, message: 'Installed date must be required',},
                                        () => ({
                                            validator(_, value) {

                                                if (value === null || value === "") {
                                                    return Promise.resolve()
                                                }else if ((new Date() - value._d) < 0) {
                                                    return Promise.reject("Asset has not been installed. Please select a different date")
                                                }
                                                else if (value._d.getFullYear() < 1950){
                                                    return Promise.reject("Can only select the date from 1950 or later. Please select a different date")
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
                                        popupStyle={{width: "26.5%", textAlign: "center"}}
                                        className="inputForm"

                                    />

                                </Form.Item>
                            {/* </Form.Item> */}
                            {/* <Form.Item > */}
                                <Form.Item label="State" name="State" rules={[{required:true, message:"State is required"}]}>

                                    <Radio.Group disabled={isLoading.isLoading === true}>
                                        <Radio value="AVAILABLE" >Available</Radio>
                                        <br/>
                                        <Radio value="NOT_AVAILABLE" >Not Available</Radio>
                                        <br/>
                                        <Radio value="WAITING_FOR_RECYCLING" >Waiting for recycling</Radio>
                                        <br/>
                                        <Radio value="RECYCLED" >Recycled</Radio>
                                    </Radio.Group>

                                </Form.Item>

                            {/* </Form.Item > */}

                            <Form.Item shouldUpdate > 
                                {() => (
                                    <Row style={{float: 'right'}}>
                                        <Button
                                            disabled={
                                                !form.isFieldsTouched(true) ||
                                                form.getFieldsError().filter(({errors}) => errors.length).length > 0
                                            }
                                            className="buttonSave"
                                            loading={isLoading.isLoading} htmlType="submit" onClick={() => {
                                            setLoading({isLoading: true})
                                            setTimeout(() => {
                                                    setLoading({isLoading: false})
                                                }, 2000
                                            )
                                            // save()
                                        }}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            className="buttonCancel"
                                            disabled={isLoading.isLoading === true} onClick={() => {
                                                navigate("/asset");}}>
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
    </>);


// 

  
}
