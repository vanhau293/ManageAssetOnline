import {Row,Col,Form,Input,Button,DatePicker, Modal, Table,Spin} from "antd";
import {SearchOutlined,LoadingOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "antd/dist/antd.css";
import moment from "moment";
import toast from 'react-hot-toast';

export default function CreateAssignment() {
    const loginState = JSON.parse(localStorage.getItem("loginState"));
    const date = new Date();
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const config = {
        headers: { Authorization: `Bearer ${loginState.token}` }
    };
    const [isLoading, setLoading] = useState({isLoading: false});
    const navigate = useNavigate();
    const [submitData, setSubmitData] = useState({
        assetName: "",
        assetId: -1,
        fullName: "",
        assignToId: -1,
        assignedDate: dd + "/" + mm + "/" + yyyy,
        note: ""
    });

    const [userInputValue, setUserInputValue] = useState(
        ''
    )
    const [assetInputValue, setAssetInputValue] = useState(
        ''
    )
    const [searchText, setSearchText] = useState("");
    const [userData, setUserData] = useState([]);
    const [assetData, setAssetData] = useState([]);
    const [userModal, setUserModal] = useState({
        isOpen: false,
        isLoading: false
    });
    const [assetModal, setAssetModal] = useState({
        isOpen: false,
        isLoading: false
    });
    const [form] = Form.useForm();
    const [disabledSubmit, setDisabledSubmit] = useState(true)


    const formItemLayout = {
        labelCol: {
            span: 7,
        },
        wrapperCol: {
            span: 15,
            offset: 1,
        },
    };

    useEffect(() => {
        axios
            .get(`https://asset-assignment-be.azurewebsites.net/api/information/location?accountid=` + loginState.id,config)
            // .get(`http://localhost:8080/api/information/location?accountid=` + loginState.id,config)
            .then(response => {
                let respData = response.data
                respData.forEach((element) => {
                    element.fullName = element.firstName + " " + element.lastName;
                })
                setUserData(respData);
            })
            .catch(() => {

            })

    }, []);

    useEffect(() => {
        axios
            .get(`https://asset-assignment-be.azurewebsites.net/api/asset/available`, config)
            // .get(`http://localhost:8080/api/asset/available`, config)
            .then(response => {
                    let respData = response.data
                    setAssetData(respData);
                }
            )
            .catch(() => {

            })
    }, [])
    const finalUserData =
        searchText === ""
            ? userData
            : userData.filter(
                (u) =>
                    (u.fullName.toLowerCase()).replace(/\s+/g, '').includes(searchText.toLowerCase().replace(/\s+/g, '')) ||
                    u.staffCode.toLowerCase().includes(searchText.toLowerCase())
            );

    const finalAssetData =
        searchText === ""
            ? assetData :
            assetData.filter(
                (u) =>
                    u.assetName.toLowerCase().includes(searchText.toLowerCase()) ||
                    u.assetCode.toLowerCase().includes(searchText.toLowerCase()) 
            );

            
    

    const handleNoteChange = (name) => {

        setSubmitData({
            ...submitData,
            note: name.target.value,
        });
    };
    const handleAssignedDateChange = (name, Datestring) => {
        setSubmitData({
            ...submitData,
            assignedDate: Datestring,
        });
    };

    const handleCreate = (fieldsValue) => {

        
        const values = {
            ...fieldsValue,
            assignedDate: fieldsValue["assignedDate"] != undefined ? fieldsValue["assignedDate"].format("DD/MM/YYYY") : submitData.assignedDate,
            accountId: submitData.assignToId,
            assetId: submitData.assetId
        };
        axios.post(`https://asset-assignment-be.azurewebsites.net/api/assignment`, {
            assignedToId: submitData.accountId,
            assetId: submitData.assetId,
            assignedDate: values.assignedDate,
            note: values.note
             
        },config)
            .then((response) => {
                setSubmitData({
                    assetId: "",
                    assignToId: "",
                    assignedDate: "",
                    note: "",
                    assetName: "",
                    fullName: "",
                });
                localStorage.setItem(
                    "assignment",
                    JSON.stringify({
                        ...response.data
                    })
                );
                toast.success("Create assignment successfully");
                navigate("/assignment");
            })
            .catch((err) => {
                toast.error("Create assignment failed");
                console.log(err);
            });
        console.log({
            assignedToId: submitData.assignToId,
            assetId: submitData.assetId,
            assignedAt: values.assignedDate,
            note: values.note
             
        });
    };
    const userColumns = [
        {
            title: "Staff code",
            dataIndex: "staffCode",
            key: "staffCode",

            sorter: (a, b) => {
                if (a.staffCode > b.staffCode) {
                    return -1;
                }
                if (b.staffCode > a.staffCode) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Full Name",
            dataIndex: "fullName",
            key: "fullName",
            sorter: (a, b) => {
                if (a.fullName > b.fullName) {
                    return -1;
                }
                if (b.fullName > a.fullName) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Type",
            dataIndex: "roleName",
            key: "roleName",
            sorter: (a, b) => {
                if (a.roleName > b.roleName) {
                    return -1;
                }
                if (b.roleName > a.roleName) {
                    return 1;
                }
                return 0;
            },
        }]
    const assetColumns = [
        {
            title: "Asset code",
            dataIndex: "assetCode",
            key: "assetCode",

            sorter: (a, b) => {
                if (a.assetCode > b.assetCode) {
                    return -1;
                }
                if (b.assetCode > a.assetCode) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Asset Name",
            dataIndex: "assetName",
            key: "assetName",
            sorter: (a, b) => {
                if (a.assetName > b.assetName) {
                    return -1;
                }
                if (b.assetName > a.assetName) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Category",
            dataIndex: "categoryName",
            key: "categoryName",
            sorter: (a, b) => {
                if (a.categoryName > b.categoryName) {
                    return -1;
                }
                if (b.categoryName > a.categoryName) {
                    return 1;
                }
                return 0;
            },
        }]

    const UserRowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {

            setDisabledSubmit(false)
            setSubmitData({
                ...submitData,
                fullName: selectedRows[0].fullName,
                accountId: selectedRowKeys[0],
            })

        },
    };
// console.log(submitData);
    const AssetRowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {

            setDisabledSubmit(false)
            setSubmitData({
                ...submitData,
                assetName: selectedRows[0].assetName,
                assetId: selectedRowKeys[0],
            })

        },

    };
    
// console.log(assetData)
    const antIcon = (
        <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
        />
    );
    return (
        <Row>
            <Modal visible={userModal.isOpen}
            style={{position: "absolute",top: "18%", left: "48%"}}
            mask={false}
                   title={false}
                   footer={[

                       <Button
                           className="buttonSave"
                           // style={{ background: "#e30c18", color: "white"}}
                           disabled={disabledSubmit} loading={userModal.isLoading} key="ok" onClick={() => {
                           setUserModal({...userModal, isLoading: true});
                           setTimeout(() => {
                               setUserModal({...userModal, isLoading: false, isOpen: false})
                           }, 1000)

                           setUserInputValue({...userInputValue, userInputValue: submitData.fullName});


                           form.setFieldsValue({fullName: submitData.fullName});
                       }}>Save</Button>,
                       <Button className="buttonCancel" disabled={userModal.isLoading === true} key="back"
                               onClick={() => {
                                   setSearchText('');
                                   setUserModal({...userModal, isOpen: false});
                                   navigate("/assignment/createAssignment");
                               }}>Cancel</Button>,


                   ]}
                   closable={false}
            >
                <div style={{display: "flex"}} className="searchModel">
                    <h2 style={{width: "40%", fontWeight: 600, color: "red"}}>Select User</h2>
                    <Input.Search
                        // width={"60%"}
                        maxLength={255}
                        allowClear
                        onSearch={(e) => {
                            setSearchText(e.replace(/ /g, ''))
                        }}
                        onEnter={(e) => {
                            setSearchText(e.replace(/ /g, ''))
                        }}
                    />
                </div>
                <Table
                    rowSelection={{
                        type: "radio",
                        ...UserRowSelection,
                    }}
                    columns={userColumns}
                    dataSource={finalUserData}
                    rowKey="accountId"
                    loading={userData.length < 1 ? (
                        <Spin />
                    ) : false}
                    pagination={{
                        defaultPageSize: 5,
                        pageSizeOptions: [2, 4, 6, 8, 10]
                    }}
                />
            </Modal>

            <Modal
                visible={assetModal.isOpen}
                mask={false}
                style={{position: "absolute",top: "24%", left: "48%"}}
                   title={false}
                   footer={[
                       <Button
                           className="buttonSave"
                           disabled={disabledSubmit} loading={assetModal.isLoading} key="ok" onClick={() => {
                           setAssetModal({...assetModal, isLoading: true});
                           setTimeout(() => {
                               setAssetModal({...assetModal, isLoading: false, isOpen: false})
                           }, 1000)
                           setAssetInputValue({...assetInputValue, assetInputValue: submitData.assetName});

                           form.setFieldsValue({assetName: submitData.assetName});


                       }}>Save</Button>,
                       <Button
                           className="buttonCancel"
                           disabled={userModal.isLoading === true} key="back" onClick={() => {
                           setSearchText('');
                           setAssetModal({...assetModal, isOpen: false});
                           navigate("/assignment/createAssignment");
                       }}>Cancel</Button>
                   ]}
                   closable={false}

            >
                <div style={{display: "flex"}} className="searchModel">
                    <h2 style={{width: "40%", fontWeight: 600, color: "red"}}>Select Asset</h2>
                    <Input.Search
                        // width={"60%"}
                        maxLength={255}
                        allowClear
                        onSearch={(e) => {
                            setSearchText(e.replace(/ /g, ''))
                        }}
                        onEnter={(e) => {
                            setSearchText(e.replace(/ /g, ''))
                        }}
                    />
                </div>
                <Table
                    rowSelection={{
                        type: "radio",
                        ...AssetRowSelection,
                    }}
                    columns={assetColumns}
                    dataSource={finalAssetData}
                    rowKey="assetId"
                    loading={assetData.length < 1 ? (
                        <Spin />
                    ) : false}
                    pagination={{
                        defaultPageSize: 5,
                        pageSizeOptions: [2, 4, 6, 8, 10]
                    }}
                />
            </Modal>
            <Col span={12} offset={4}>
                <div className="content">
                    <Row style={{marginBottom: "10px"}} className="fontHeaderContent">
                        Create New Assignment
                    </Row>
                    <Row
                        style={{marginTop: "10px", marginLeft: "5px", display: "block"}}
                    >
                        <Form
                            name="complex-form"
                            {...formItemLayout}
                            onFinish={handleCreate}
                            labelAlign="left"
                            form={form}
                        >
                            <Form.Item label="User" style={{marginBottom: 0}}>
                                <Form.Item
                                    name="fullName"
                                    // rules={[{ required: true, message: "Username must be required" },
                                    // { whitespace: true, message: 'Username can not be empty' },
                                    // { max: 50, message: 'Username must be less than 50 characters long' }
                                    // ]}
                                    style={{display: "block"}}
                                >

                                    <Input
                                        readOnly
                                        disabled={isLoading.isLoading === true}
                                        className="inputForm"
                                        value={userInputValue}
                                        maxLength={51}
                                        list="fullName"
                                        suffix={<span onClick={() => {
                                            setUserModal({...userModal, isOpen: true})
                                        }
                                        }><SearchOutlined/></span>}
                                    >

                                    </Input>

                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="Asset" style={{marginBottom: 0}}>
                                <Form.Item
                                    name="assetName"
                                    // rules={[{ required: true, message: "Asset name must be required" },
                                    // { whitespace: true, message: 'Asset can not be empty' },
                                    // { max: 50, message: 'Asset must be less than 50 characters long' }
                                    // ]}
                                    style={{display: "block"}}
                                >
                                    <Input
                                        readOnly={true}
                                        disabled={isLoading.isLoading === true}
                                        className="inputForm"
                                        value={assetInputValue}
                                        maxLength={51}
                                        list="assetName"
                                        suffix={<span onClick={() => {
                                            setAssetModal({...assetModal, isOpen: true})
                                        }
                                        }><SearchOutlined/></span>}
                                        // onClick={() => {
                                        //     setAssetModal({...assetModal, isOpen: true})
                                        // }}
                                    />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="Assigned Date" style={{marginBottom: 0}}>
                                <Form.Item
                                    name="assignedDate"
                                    rules={[
                                        (fieldvalue) => ({
                                            validator(_, value) {

                                                if (moment(new Date().getDate(), "DD-MM-YYYY").isAfter(value, "DD-MM-YYYY")) {
                                                    return Promise.reject('Assigned Date can not be in the past')
                                                } else {
                                                    return Promise.resolve()
                                                }

                                            }
                                        })
                                    ]}
                                    style={{display: "block"}}
                                >
                                    <DatePicker
                                        disabled={isLoading.isLoading === true}
                                        style={{display: "block"}}
                                        popupStyle={{width: "25%", textAlign: "center"}}
                                        className="inputForm"
                                        format="DD/MM/YYYY"
                                        value={submitData.assignedDate}
                                        defaultValue={() => {
                                            return moment(date.getDate().toString(),"DD/MM/YYYY")
                                        }}
                                        onChange={handleAssignedDateChange}
                                        
                                    />
                                </Form.Item>
                            </Form.Item>

                            <Form.Item label="Note" >
                                <Form.Item
                                    name="note"
                                    rules={[
                                        {
                                            pattern: new RegExp("^[a-zA-Z'\n\r\-|!*\"\\#$%&/()=?»«@£§€{}.;'<>_,^+~\t ]+$"),
                                            message: "Don't allow Unicode UTF-8 characters for this filed"
                                        },
                                        {whitespace: true, message: 'Note must be required'},
                                        {max: 500, message: 'Note must be less than 500 characters long'}
                                    ]}
                                >
                                    <Input.TextArea
                                        disabled={isLoading.isLoading === true}
                                        className="inputForm"
                                        value={submitData.note}
                                        maxLength={501}
                                        onChange={handleNoteChange}
                                        rows="3" cols="20"
                                    />
                                </Form.Item>
                            </Form.Item>

                            <Form.Item shouldUpdate >
                                {()=>(
                                <Row style={{float: "right"}}>
                                        <Button
                                            disabled={
                                                // !form.isFieldsTouched(true) ||
                                                (submitData.assetName == "" || submitData.fullName == "" ) ||
                                                form.getFieldsError().filter(({errors}) => errors.length).length > 0
                                            }
                                            className='buttonSave'
                                            // style={{width :"40px"}}
                                            loading={isLoading.isLoading}
                                            htmlType="submit"
                                            onClick={() => {
                                                setLoading({isLoading: true});
                                                setTimeout(() => {
                                                    setLoading({isLoading: false})
                                                }, 1000)
                                                // handleCreate()
                                            }}
                                        >
                                            Save
                                        </Button>


                                        <Button
                                            className="buttonCancel"
                                            style={{width: "40px" }}
                                            disabled={isLoading.isLoading === true}
                                            onClick={() => {
                                                navigate("/assignment");
                                            }}
                                        >
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
    )
}