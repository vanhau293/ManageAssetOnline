import React from "react";
import "antd/dist/antd.css";
import "../users/CreateUser.css";
import { useState } from "react";
import {Row, Col, Form, Input, Select, Button, DatePicker, Radio, Divider} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
export default function CreateAsset(){

    const [isLoading, setLoading] = useState(false);
    const loginState = JSON.parse(localStorage.getItem("loginState"));
    const navigate = useNavigate();
    const [listCategory, setListCategory] = useState([{}]);
    const [categoryName, setCategoryName] = useState("");
    const [key, setKey] = useState("");
    const {Option} = Select;
    const [form] = Form.useForm();
    const config = {
        headers: { Authorization: `Bearer ${loginState.token}` }
    };
    const [addCategory, setAdd] = useState(false);
    const formItemLayout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 18,
            offset: 1,
        },
    };
    const addItem = () => {
        var bt = new RegExp("^[a-zA-Z'\-|!*\"\\#$%&/()=?»«@£§€{}.;'<>_,^+~ ]+$")
        if(!categoryName.match(bt)){
            toast.error("Don't allow Unicode UTF-8 characters for this filed");
            return;
        }
        if(!key.match(bt)){
            toast.error("Don't allow Unicode UTF-8 characters for this filed");
            return;
        }
        console.log(categoryName + "   "+ key)
        axios
            .post(`https://asset-assignment-be.azurewebsites.net/api/category`, {
                categoryName : categoryName.trim(),
                key: key.trim()
            }, config)
            .then((response) => {
                setTimeout(() => {
                    setLoading({isLoading: false});
                }, 2000)
                console.log(response.data);
                getCategories();
                toast.success("Create new category successfully");
                setElementCategory(
                    <Button type="link" onClick= {onAddCategory}><u>Add new category</u></Button>
                )
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                console.log(error)
            });
        
    }
    const cancelItem = () => {
        setAdd(false) ;
        
    }
    const onAddCategory = ()=>{
        setCategoryName('');
        setKey('')
        setAdd(true)
        
    }
    const [elementCategory, setElementCategory] = useState(
        <Button type="link" onClick= {onAddCategory}><u>Add new category</u></Button>
    )
    
    const getCategories = () =>{
        axios.get('https://asset-assignment-be.azurewebsites.net/api/category', config)
            .then((response) =>{
                setTimeout(() => {
                    setLoading({isLoading: false});
                }, 2000)
                setListCategory(response.data);
            }).catch((errors) =>{
             console.log(errors);
            // localStorage.removeItem("loginState");
            //     window.location.href = "https://mango-tree-0d1b58810.1.azurestaticapps.net/";
        });
    };
    

    useEffect(() =>{
        getCategories();
    }, [])
    useEffect(() =>{
        console.log(addCategory)
        if(addCategory === true){
        setElementCategory(
            <>
            <Row>
            <Input.Group compact>
                <Input className="categoryName"
                    enterKeyHint="Category"
                    placeholder="Category name"
                    onChange={(e)=> { setCategoryName(e.target.value)}}
                    
                />
                <Input className="prefix"
                    enterKeyHint="Prefix"
                    placeholder="Prefix"
                    onChange={(e)=> { setKey(e.target.value)}}
                />
                </Input.Group>
                <Button type="link" className="addButton" disabled={(categoryName.trim().length===0 || key.trim().length===0)}><FontAwesomeIcon 
                                       
                    onClick={addItem}
                    icon={faCheck} /></Button>
                
                <Button type="link" className="cancelButton"><FontAwesomeIcon 
                     
                    onClick={cancelItem}
                    icon={faXmark} />
                </Button>
                </Row>
                </>
        )}
        else{
            setElementCategory(
                <Button type="link" onClick= {onAddCategory}><u>Add new category</u></Button>
            )
        }
        
    }, [categoryName, key, addCategory])


    const onFinish = (fieldsValue) => {
        const values = {
            ...fieldsValue,
            InstalledDate: fieldsValue["InstalledDate"].format("DD/MM/YYYY"),
        };
        console.log(values);
        axios
            .post(`https://asset-assignment-be.azurewebsites.net/api/asset`, {
                prefix: values.Category,
                specification: values.Specification,
                install: values.InstalledDate,
                status:values.State,
                name:values.Name
            }, config)
            .then((response) => {
                setTimeout(() => {
                    setLoading({isLoading: false});
                }, 2000)
                localStorage.setItem(
                    "asset",
                    JSON.stringify({
                        ...response.data
                    })
                );
                toast.success("Create a new asset successfully");
                console.log(response.data);
                navigate("/asset");

            })
            .catch((error) => {
                toast.error("Create new asset failed");
                console.log(error)
                console.log(error.response.data.message);
                // localStorage.removeItem("loginState");
                // window.location.href = "https://mango-tree-0d1b58810.1.azurestaticapps.net/";
            });
    }



    return (<>
        <Row>
            <Col span={12} offset={6}>
                <div className="content" style={{height :"100vh"}}>
                    <Row className= "fontHeaderContent">
                        Create New Asset
                    </Row>
                    <Row className="formCreate">
                        <Form
                            form={form}
                            name="complex-form"
                            onFinish={onFinish}
                            {...formItemLayout}
                            labelAlign="left"
                            initialValues={{
                                State: 'Available'
                              }}
                        >
                            <Form.Item className="labelCreate" label="Name" >
                                <Form.Item
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
                                    hasFeedback
                                >
                                    <Input disabled={isLoading.isLoading === true} maxLength={129}
                                           className="inputForm"/>
                                </Form.Item>
                            </Form.Item>

                            <Form.Item label="Category">
                                <Form.Item
                                    name="Category"
                                    rules={[{required: true, message: 'You must choose a category for this asset'}]}
                                    
                                >
                                    <Select
                                        disabled={isLoading===true}
                                        showSearch 
                                        className="inputForm"
                                        optionFilterProp="children"
                                        dropdownRender={(menu) => (
                                          <>
                                            {menu}
                                            <Divider
                                              
                                            />
                                            {elementCategory}
                                          </>
                                        )}
                                 >


                                        {listCategory.map((item,index) =>(
                                            <Option
                                                value={item.key}
                                                key={item.categoryId}
                                            >{item.categoryName}</Option>
                                        ))};
                                    </Select>
                                </Form.Item>
                            </Form.Item>

                            <Form.Item label="Specification" 
                            >
                                <Form.Item
                                    name="Specification"
                                    rules={[
                                        
                                        () => ({
                                            validator(_, value) {
                                                if ((value.trim())==='') {
                                                    return Promise.reject("Specification must be required")
                                                }
                                                else if(!value.match(new RegExp("^[a-zA-Z'\n\r\-|!*\"\\#$%&/()=?»«@£§€{}.;'<>_,^+~\t ]+$"))){
                                                    console.log(value)
                                                    return Promise.reject("Don't allow Unicode UTF-8 characters for this filed")
                                                }
                                                else if ((value.length)>500) {
                                                    return Promise.reject("Specification must be less than 500 characters")
                                                }
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}
                                    hasFeedback
                                >
                                <TextArea 
                                          className="largeInput"
                                          rows="5" cols="20"
                                          maxLength={501}
                                >

                                </TextArea>
                                </Form.Item>

                            </Form.Item>

                            <Form.Item label="Installed Date" >
                                <Form.Item
                                    name="InstalledDate"
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
                                    hasFeedback
                                >

                                    <DatePicker
                                        disabled={isLoading.isLoading === true}
                                        format="DD/MM/YYYY"

                                        className="inputForm"
                                    />

                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="State">
                                <Form.Item name="State" rules={[{required:true, message:"State is required"}]}>

                                    <Radio.Group disabled={isLoading.isLoading === true}>
                                        <Radio value="Available" >Available</Radio>
                                        <br/>
                                        <br/>
                                        <Radio value="Not_Available" >Not Available</Radio>
                                    </Radio.Group>

                                </Form.Item>

                            </Form.Item >

                            <Form.Item shouldUpdate > 
                                {() => (
                                    <Row style={{float: 'right'}}>
                                        < Button
                                            disabled={
                                                !form.isFieldTouched("Category") || !form.isFieldTouched("Specification")
                                                || !form.isFieldTouched("InstalledDate") || !form.isFieldTouched("Name") 
                                                ||form.getFieldsError().filter(({errors}) => errors.length).length > 0
                                            }
                                            className="buttonSave"
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
