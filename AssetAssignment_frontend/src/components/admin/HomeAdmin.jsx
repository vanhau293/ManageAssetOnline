import {Table, Modal, Button} from 'antd';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {CheckOutlined, CloseOutlined, CloseSquareOutlined, ReloadOutlined} from "@ant-design/icons";
import moment from "moment";
import "../admin/users/CreateUser.css"
import "./assignments/viewAssignments/ViewInfo.css"
import "./Modal.css"
import toast, {Toaster} from "react-hot-toast";
export default function Home() {
    const [data, setData] = useState([])
    const [modal, setModal] = useState({
        isOpen: false,
        data: {},
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalCancelVisible, setIsModalCancelVisible] = useState(false);
    const [isModalReturnVisible, setIsModalReturnVisible] = useState(false);
    const [idCompleted, setIdCompleted] = useState();
   let loginState = JSON.parse(localStorage.getItem("loginState"));
    

    const showModal = () => {
        setIsModalVisible(true);

    };
    const handleOk = () => {
        setIsModalVisible(false);
        console.log(idCompleted)
        axios
            .put(`https://asset-assignment-be.azurewebsites.net/api/assignment/` + idCompleted +`?state=ACCEPTED`,{}, {
                headers: { Authorization: `Bearer ${loginState.token}` }
            })  // api assignment accepted
            .then((res) => {

                
                toast.success("Accepted Request Success !!!");
                window.location.reload();
                setIdCompleted(null)
            }).catch((error) => {
                console.log(error)
        })


    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleCheckId = (id) => {
        setIdCompleted(id)
    }
//===============================================================
    const showModalDelete = () => {
        setIsModalCancelVisible(true);

    };
    const handleCheckDeleteId = (id) => {

        setIdCompleted(id)
    }
    const handleDeleteOk = () => {
        setIsModalCancelVisible(false);
        axios
            .put(`https://asset-assignment-be.azurewebsites.net/api/assignment/` + idCompleted +`?state=DECLINE`,{}, {
                headers: { Authorization: `Bearer ${loginState.token}` }}) // link api assignment declined
            .then((res) => {
                setIdCompleted(null)
                
                toast.success("Decline Request Success !!!");
                window.location.reload();
            }).catch((error) => {
                console.log(error)
        })
    }
    const handleCancelModal = () => {
        setIsModalCancelVisible(false);
    };
//===========================================================
    const showModalReturn = () => {
        setIsModalReturnVisible(true);
    }
    const handleCheckReturnId = (id) => {
        setIdCompleted(id)
    }
    const handleReturnOk = () => {
        setIsModalReturnVisible(false);
        axios.post(`https://asset-assignment-be.azurewebsites.net/api/request/` + idCompleted + `?user=` + loginState.id, null, {
            headers: { Authorization: `Bearer ${loginState.token}` }
       })
            .then(
                (response) =>{
                    setIsModalReturnVisible(false);
                    toast.success("Create Returning Request Success !!!");
                    window.location.reload();
                }).catch(
            (error) =>{
                setIsModalReturnVisible(false);
                toast.error(error.response.data.message);
                console.log(error)
            })
    }
    const handleCancelReturnModal = () => {
        setIsModalReturnVisible(false);
    };
//===============================================
    useEffect(() => {
        // if(loginState===null) window.location.reload();
        loginState = JSON.parse(localStorage.getItem('loginState'));
        if (loginState===null) return;

        axios
            .get(`https://asset-assignment-be.azurewebsites.net/api/assignment/user`, {
                headers: { Authorization: `Bearer ${loginState.token}` }
           }) // all staff assignment
            .then((response) => {
                console.log(response.data)
                let respData = response.data
                respData.forEach((element) => {
                    element.state = element.state === 'WAITING_FOR_ACCEPTANCE' ? 'WAITING FOR ACCEPTANCE' : element.state;
                    element.state = element.state === 'WAITING_FOR_RETURNING' ? 'WAITING FOR RETURNING' : element.state;
                    element.action = [
                        <Button
                            className='buttonState'
                            disabled={element.state === 'ACCEPTED'|| element.state === 'DECLINE' || element.state === 'WAITING FOR RETURNING' || element.state === 'COMPLETED' || element.isInProgress === false}
                            onClick={() => {
                                console.log(element.assignmentId)
                                showModal()
                                handleCheckId(element.assignmentId)
                            }}
                        >
                            <CheckOutlined
                                style={{color: 'red'}}
                            />
                        </Button>,
                        <Button
                            className="buttonState"
                            disabled={element.state === 'ACCEPTED'|| element.state === 'DECLINE' || element.state === 'WAITING FOR RETURNING' || element.state === 'COMPLETED' || element.isInProgress === false}
                            onClick={() => {
                                showModalDelete()
                                handleCheckDeleteId(element.assignmentId)
                            }}
                        >
                            <CloseOutlined style={{color: 'black'}}/>
                        </Button>,
                        <Button
                            className='buttonState'
                            disabled={element.state === 'WAITING FOR ACCEPTANCE'|| element.state === 'DECLINE' || element.state === 'WAITING FOR RETURNING' || element.state === 'COMPLETED' || element.isInProgress === false}
                            onClick={() => {
                                showModalReturn()
                                handleCheckReturnId(element.assignmentId)
                            }}
                        >
                            <ReloadOutlined
                                style={{color: 'blue'}}
                            /></Button>

                    ]
                })
                setData(response.data);


            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    const columns = [

        
        {
            title: "Asset Code",
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
            title: "Assigned Date",
            dataIndex: "assignedDate",
            key: "assignedDate",
            sorter: (a, b) => {
                if (a.assignedDate > b.assignedDate) {
                    return -1;
                }
                if (b.assignedDate > a.assignedDate) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Assigned By",
            dataIndex: "assignedBy",
            key: "assignedBy",
            sorter: (a, b) => {
                if (a.assignedBy > b.assignedBy) {
                    return -1;
                }
                if (b.assignedBy > a.assignedBy) {
                    return 1;
                }
                return 0;
            },
        },

        {
            title: "State",
            dataIndex: "state",
            key: "state",
            sorter: (a, b) => {
                if (a.state > b.state) {
                    return -1;
                }
                if (b.state > a.state) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "",
            dataIndex: "action",
            key: "action",
        },
    ];
    return (
        <>
            <Modal
                className={"view-information"}
                visible={modal.isOpen}
                title='Detail Assignment Information'
                onCancel={()=>{setModal({...modal,isOpen:false})}}
                closeIcon={<CloseSquareOutlined style={{color: "red", fontSize: "20px"}}/>}
                style={{paddingBottom: "20px"}}
                footer={
                    null
                }
                       >
                    {
                        modal.data.specification===undefined || modal.data.note===undefined
                        ?
                        <></>
                        :
                        <>
                                    
                            
                            <div className="asset-code">
                                <p className = "text-view-information">Asset Code</p>
                                <p className = "text-view-information" id="data-asset-code" >{modal.data.assetCode}</p>
                            </div>
                            <div className = "asset-name">
                                <p  className = "text-view-information">Asset Name</p>
                                <p  className = "text-view-information" id="data-asset-name" style={{paddingLeft: "55px"}}>{modal.data.assetName}</p>
                            </div>
                            {
                                modal.data.specification.length > 45 ?
                                <div className="specification" id="myDIV">
                                    <p className="text-view-information" style={{verticalAlign: "top"}}>Specification</p>
                                    <div className="ex2 text-view-information" id="data-specification"
                                        style={{paddingLeft: "50px"}}>{modal.data.specification}
                                    </div>
                                </div>
                                :
                                <div className="specification">
                                    <p className="text-view-information">Specification</p>
                                    <p className="text-view-information" id="data-specification"
                                    style={{paddingLeft: "50px"}}>{ modal.data.specification}</p>
                                </div>
                            }
                            
                            <div className="assigned-to">
                                <p className="text-view-information">Assigned to</p>
                                <p className="text-view-information" id="data-assigned-to"
                                style={{paddingLeft: "55px"}}>{modal.data.assignTo}</p>
                            </div>
                            <div className="assigned-by">
                                <p className="text-view-information">Assigned by</p>
                                <p className="text-view-information" id="data-assigned-by"
                                style={{paddingLeft: "54px"}}>{modal.data.assignedBy}</p>
                            </div>
                            <div className="assigned-date">
                                <p className="text-view-information">Assigned Date</p>
                                <p className="text-view-information" id="data-assigned-date"
                                style={{paddingLeft: "40px"}}>{modal.data.assignedDate}</p>
                            </div>
                            <div className="state">
                                <p className="text-view-information">State</p>
                                <p className="text-view-information" id="data-state"
                                style={{paddingLeft: "97px"}}>{modal.data.state}</p>
                            </div>
                            {
                                modal.data.note===null || modal.data.note.length > 50  ?
                                    <div className="note" style={{marginBottom: "15px", height: "70px"}} id="myDIV">
                                        <p className="text-view-information note-view" style={{verticalAlign: "top"}}>Note</p>
                                        <div className="ex1 text-view-information" id="data-note"
                                            style={{paddingLeft: "97px"}}>{modal.data.note}
                                        </div>
                                    </div>
                                    :
                                    <div className="note">
                                        <p className="text-view-information">Note</p>
                                        <p className="text-view-information" id="data-note"
                                        style={{paddingLeft: "97px"}}>{modal.data.note}</p>
                                    </div>
                            }
                        </>
                    }
                    


            </Modal>
            <Modal className = "modalConfirm"
                closable={false}
                title="Are You Sure?" visible={isModalVisible} okText="Yes" cancelText="No" onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <div style={{textAlign: "center"}}>
                        <Button key="Yes" onClick={handleOk} className="buttonSave">Accept</Button>
                        <Button key="No" onClick={handleCancel} className='buttonCancel'>Cancel</Button>
                    </div>
                ]}>
                <p>Do you want to accept this assignment?</p>
            </Modal>
            <Modal className = "modalConfirm"
            
                closable={false}
                title="Are You Sure?" visible={isModalCancelVisible} okText="Yes" cancelText="No" onOk={handleDeleteOk}
                onCancel={handleCancelModal}
                footer={[
                    <div>
                        <Button key="Yes" onClick={handleDeleteOk} className="buttonSave">Decline</Button>
                        <Button key="No" onClick={handleCancelModal} className=' buttonCancel'>Cancel</Button>
                    </div>
                ]}>
                <p>Do you want to decline this assignment?</p>
            </Modal>
            
            <Modal className = "modalConfirm"
                closable={false}
                title="Are You Sure?" visible={isModalReturnVisible} okText="Yes" cancelText="No" onOk={handleReturnOk}
                onCancel={handleCancelReturnModal}
                footer={[
                    <div>
                        <Button className="buttonSave" key="Yes" onClick={handleReturnOk}>Yes</Button>
                        <Button className="buttonCancel" key="No" onClick={handleCancelReturnModal}>No</Button>
                    </div>
                ]}>
                <p>Do you want to create a returning request for this asset?</p>
            </Modal>


            <div>
                <h1 style={{color: "red", float: "left"}}>My Assignment</h1>
                <Table
                    columns={columns}
                    dataSource={data}
                    onRow={(record) => {
                        return {
                            onClick: (e) => {


                                if (e.target.className !== 'ant-table-cell ant-table-cell-row-hover') {
                                    setModal({...modal, isOpen: false})
                                } else {
                                    setModal({
                                        ...modal, isOpen: true
                                        , data: {
                                            id: record.id,
                                            assetCode: record.assetCode,
                                            assetName: record.assetName,
                                            assignTo: record.assignedTo,
                                            specification: record.specification,
                                            assignedBy: record.assignedBy,
                                            assignedDate: record.assignedDate,
                                            state: record.state,
                                            note: record.note
                                        }

                                    });

                                }


                            }
                        }
                    }}
                >

                </Table>
            </div>

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
    )
}