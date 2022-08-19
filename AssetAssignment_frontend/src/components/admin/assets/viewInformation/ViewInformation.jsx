import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Modal} from 'antd';
import "./ViewInformation.css"
import {CloseCircleOutlined, CloseSquareOutlined, LoadingOutlined} from "@ant-design/icons";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons";

export default function ViewInformationAsset(props) {
    const [isModalVisible, setIsModalVisible] = useState(true);
    const [Information, setInformation] = useState([])
    const [listHistory, setListHistory] = useState([])

    const handleCancel = () => {
        setIsModalVisible(false);
        props.isVisible();
    };
    let user = JSON.parse(localStorage.getItem('loginState'));
    const config = {
        headers: {Authorization: `Bearer ${user.token}`}
    };
    const getInformationAsset = () => {
        axios
            .get("https://asset-assignment-be.azurewebsites.net/api/asset/" + props.dataUser.assetId, config)
            .then(function (response) {
                setInformation(response.data)
                setListHistory(response.data.assignmentDtoList)

            })
            .catch((error) => {
            });
    };

    useEffect(() => {
        getInformationAsset();
        console.log(isModalVisible);
    }, []);

    function changeState(s) {
        if (s === "WAITING_FOR_RECYCLING") {
            s = "WAITING FOR RECYCLING"
        }
        if(s === "NOT_AVAILABLE"){
            s = "NOT AVAILABLE"
        }
        return s
    }


    return (
        <>
            <Modal className="view-history"
                   closable={true}
                   onCancel={handleCancel}
                   footer={null}
                   maskStyle={{opacity: 0.1}}
                   title="Detailed Asset Information"
                   visible={isModalVisible}
                   style={{left: "190px", marginTop: "10px"}}
                   closeIcon={<CloseSquareOutlined/>}
            >
                {
                    Information.length === 0 ?
                        <LoadingOutlined
                            style={{
                                fontSize: "60px",
                                color: "red",
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: "30px",
                            }}/>
                        :

                        <>

                            <div className="asset-code">
                                <p className="text-view-information">Asset Code</p>
                                <p className="text-view-information" id="data-asset-code">{Information.assetCode}</p>
                            </div>
                            <div className="asset-name">
                                <p className="text-view-information">Asset Name</p>
                                <p className="text-view-information" id="data-asset-name"
                                   style={{paddingLeft: "55px"}}>{Information.assetName}</p>
                            </div>
                            <div className="assigned-to">
                                <p className="text-view-information">Category</p>
                                <p className="text-view-information" id="data-category"
                                   style={{paddingLeft: "73px"}}>{Information.categoryName}</p>
                            </div>
                            <div className="assigned-by">
                                <p className="text-view-information">Installed Date</p>
                                <p className="text-view-information" id="data-installed-date"
                                   style={{paddingLeft: "44px"}}>{Information.installedDate}</p>
                            </div>
                            <div className="state">
                                <p className="text-view-information">State</p>
                                <p className="text-view-information" id="data-state"
                                   style={{paddingLeft: "97px"}}>{changeState(Information.state)}</p>
                            </div>
                            <div className="assigned-date">
                                <p className="text-view-information">Location</p>
                                <p className="text-view-information" id="data-location"
                                   style={{paddingLeft: "75px"}}>{Information.location}</p>
                            </div>
                            {
                                Information.specification === null ?
                                    <div className="specification">
                                        <p className="text-view-information">Specification</p>
                                        <p className="text-view-information" id="data-specification"
                                           style={{paddingLeft: "49px"}}>{Information.specification}</p>
                                    </div>
                                    :
                                    <>
                                        {
                                            Information.specification.length > 60 ?
                                                <div className="specification" id="myDIV" >
                                                    <p className="text-view-information"
                                                       style={{verticalAlign: "top"}}>Specification</p>
                                                    <div className="ex5 text-view-information" id="data-specification"
                                                         style={{paddingLeft: "49px"}}>{Information.specification}
                                                    </div>
                                                </div>
                                                :
                                                <div className="specification">
                                                    <p className="text-view-information">Specification</p>
                                                    <p className="text-view-information" id="data-specification"
                                                       style={{paddingLeft: "49px"}}>{Information.specification}</p>
                                                </div>
                                        }
                                    </>
                            }


                            {
                                listHistory.length === 0 ?
                                    <div className="specification" id="myDIV-asset">
                                        <p className="text-view-information" style={{verticalAlign: "top" , marginTop:"4px"}}>History</p>
                                        <div className="ex4 text-view-information" id="data-history"
                                             style={{marginLeft: "80px" , height : "35px"}}>

                                            <table style={{marginLeft: "0", marginTop: "0"}}>
                                                <thead>
                                                <tr>
                                                    <th className="col_asset col_date_history" style={{width: "10%"}}>
                                                        <p className="col_1 date_asset_col">Date
                                                        </p>
                                                    </th>
                                                    <th className="col_asset col_assigned_to_history" style={{width: "10%"}}>
                                                        <p className=" col_1 assigned_to_asset_col">Assigned to
                                                        </p>
                                                    </th>
                                                    <th className="col_asset col_assigned_by_history" style={{width: "10%"}}>
                                                        <p className="col_1 assigned_by_col">Assigned by
                                                        </p>
                                                    </th>
                                                    <th className="col_asset col_returned_date_history"
                                                        style={{marginTop: "5px", width: "10%"}}>
                                                        <p className="col_1 col_returned_date_col">Returned Date
                                                        </p>
                                                    </th>
                                                </tr>
                                                </thead>

                                            </table>
                                        </div>
                                    </div>
                                    :
                                    <div className="specification" id="myDIV-asset">
                                        <p className="text-view-information" style={{verticalAlign: "top" ,  marginTop:"4px"}}>History</p>
                                        <div className="ex4 text-view-information" id="data-history"
                                             style={{marginLeft: "80px"}}>

                                            <table style={{marginLeft: "0", marginTop: "0"}}>
                                                <thead>
                                                <tr>
                                                    <th className="col_asset col_date_history" style={{width: "10%"}}>
                                                        <p className="col_1 date_asset_col">Date
                                                        </p>
                                                    </th>
                                                    <th className="col_asset col_assigned_to_history" style={{width: "10%"}}>
                                                        <p className=" col_1 assigned_to_asset_col">Assigned to
                                                        </p>
                                                    </th>
                                                    <th className="col_asset col_assigned_by_history" style={{width: "10%"}}>
                                                        <p className="col_1 assigned_by_col">Assigned by
                                                        </p>
                                                    </th>
                                                    <th className="col_asset col_returned_date_history"
                                                        style={{marginTop: "5px", width: "10%"}}>
                                                        <p className="col_1 col_returned_date_col">Returned Date
                                                        </p>
                                                    </th>
                                                </tr>
                                                </thead>

                                                {

                                                    listHistory.map((item, index) => (
                                                        <>
                                                            <tr>
                                                                <td className="col_asset col_date_history">
                                                                    <p className="col  assetCode_asset_col">{item.assignedDate}
                                                                    </p>
                                                                </td>
                                                                <td className="col_asset col_assigned_to_history">
                                                                    <p className="col assetName_col">{item.assignedTo}
                                                                    </p>
                                                                </td>
                                                                <td className="col_asset col_assigned_by_history">
                                                                    <p className="col assetCategory_col">{item.assignedBy}
                                                                    </p>
                                                                </td>
                                                                <td className="col_asset col_returned_date_history">
                                                                    {
                                                                        item.returnedDay === null ?
                                                                            <p className="col assetCategory_col">No returned date </p>
                                                                            :
                                                                            <p className="col assetCategory_col">{item.returnedDay}</p>

                                                                    }
                                                                </td>
                                                            </tr>
                                                        </>
                                                    ))
                                                }


                                            </table>
                                        </div>
                                    </div>

                            }

                        </>
                }

            </Modal>

        </>
    )
}
