import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Modal} from 'antd';
import "./ViewInfo.css"
import {CloseSquareOutlined} from "@ant-design/icons";
import axios from "axios";

export default function ViewInformationAssignment(props) {
    const [isModalVisible, setIsModalVisible] = useState(true);
    const [Information, setInformation] = useState([])
    const handleCancel = () => {
        setIsModalVisible(false);
        props.isVisible();
    };
    let user = JSON.parse(localStorage.getItem('loginState'));
    const config = {
        headers: {Authorization: `Bearer ${user.token}`}
    };
    console.log(props.dataUser)
    const getInformationAssignment = () => {
        axios
            .get("https://asset-assignment-be.azurewebsites.net/api/assignment/" + props.dataUser.assignmentId, config)
            .then(function (response) {
                setInformation(response.data)

            })
            .catch((error) => {
            });
    };

    useEffect(() => {
        getInformationAssignment();
        console.log(isModalVisible);
    }, []);


    return (
        <>
            <Modal className="view-information"
                   closable={true}
                   onCancel={handleCancel}
                   footer={null}
                   maskStyle={{opacity: 0.1}}
                   title="Detailed Assignment Information"
                   visible={isModalVisible}
                   style={{left: "190px", marginTop: "10px"}}
                   closeIcon={<CloseSquareOutlined/>}
            >
                <div className="asset-code">
                    <p className="text-view-information">Asset Code</p>
                    <p className="text-view-information" id="data-asset-code">{props.dataUser.assetCode}</p>
                </div>
                <div className="asset-name">
                    <p className="text-view-information">Asset Name</p>
                    <p className="text-view-information" id="data-asset-name"
                       style={{paddingLeft: "55px"}}>{props.dataUser.assetName}</p>
                </div>
                {
                    props.dataUser.specification === null ?
                        <div className="specification">
                            <p className="text-view-information">Specification</p>
                            <p className="text-view-information" id="data-specification"
                               style={{paddingLeft: "50px"}}>{props.dataUser.specification}</p>
                        </div>
                        :
                        <>
                            {
                                props.dataUser.specification.length > 45 ?
                                    <div className="specification" id="myDIV">
                                        <p className="text-view-information" style={{verticalAlign: "top"}}>Specification</p>
                                        <div className="ex2 text-view-information" id="data-specification"
                                             style={{paddingLeft: "50px"}}>{props.dataUser.specification}
                                        </div>
                                    </div>
                                    :
                                    <div className="specification">
                                        <p className="text-view-information">Specification</p>
                                        <p className="text-view-information" id="data-specification"
                                           style={{paddingLeft: "50px"}}>{props.dataUser.specification}</p>
                                    </div>
                            }
                        </>
                }

                <div className="assigned-to">
                    <p className="text-view-information">Assigned to</p>
                    <p className="text-view-information" id="data-assigned-to"
                       style={{paddingLeft: "55px"}}>{props.dataUser.assignedTo}</p>
                </div>
                <div className="assigned-by">
                    <p className="text-view-information">Assigned by</p>
                    <p className="text-view-information" id="data-assigned-by"
                       style={{paddingLeft: "54px"}}>{props.dataUser.assignedBy}</p>
                </div>
                <div className="assigned-date">
                    <p className="text-view-information">Assigned Date</p>
                    <p className="text-view-information" id="data-assigned-date"
                       style={{paddingLeft: "40px"}}>{props.dataUser.assignedDate}</p>
                </div>
                <div className="state">
                    <p className="text-view-information">State</p>
                    <p className="text-view-information" id="data-state"
                       style={{paddingLeft: "97px"}}>{props.dataUser.state}</p>
                </div>
                {
                    props.dataUser.note === null ?
                        <div className="note">
                            <p className="text-view-information">Note</p>
                            <p className="text-view-information" id="data-note"
                               style={{paddingLeft: "97px"}}>{props.dataUser.note}</p>
                        </div>
                        :
                        <>
                            {
                                props.dataUser.note.length > 50 ?
                                    <div className="note" style={{marginBottom: "15px", height: "70px"}} id="myDIV">
                                        <p className="text-view-information note-view" style={{verticalAlign: "top"}}>Note</p>
                                        <div className="ex1 text-view-information" id="data-note"
                                             style={{paddingLeft: "97px"}}>{props.dataUser.note}
                                        </div>
                                    </div>
                                    :
                                    <div className="note">
                                        <p className="text-view-information">Note</p>
                                        <p className="text-view-information" id="data-note"
                                           style={{paddingLeft: "97px"}}>{props.dataUser.note}</p>
                                    </div>
                            }
                        </>


                }


            </Modal>

        </>
    )
}
