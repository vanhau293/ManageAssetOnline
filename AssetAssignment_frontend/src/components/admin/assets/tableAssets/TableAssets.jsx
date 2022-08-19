import React, {useState, useEffect} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimesCircle, faSortDown, faPencilAlt, faSortUp} from '@fortawesome/free-solid-svg-icons';
import "antd/dist/antd.css";
import "./TableAssets.css"
import {ReloadOutlined, CloseCircleOutlined, LoadingOutlined} from "@ant-design/icons";
import {Modal, Button} from 'antd';
import {useNavigate} from "react-router-dom";
import axios from 'axios';

import toast, {Toaster} from "react-hot-toast";
import ViewInformationAssignment from "../../assignments/viewAssignments/ViewInforAssignment";
import ViewInformationAsset from "../viewInformation/ViewInformation";


function TableAsset(props) {
    const asset = JSON.parse(localStorage.getItem("asset"));
    const loginState = JSON.parse(localStorage.getItem("loginState"));
    const [displayList, setDisplayList] = useState(props.listAsset);
    const navigate = useNavigate();
    const [modalConfirmDelete, setModalConfirmDelete] = useState({
        isOpen: false,
        isLoading: false,
    });
    const [dataUser, setDataUser] = useState(false)
    const [isModal, setModal] = useState({
        isOpen: false,
        isLoading: false,
    });
    const setIsOpen = () => {
        setModal({...isModal, isOpen: !isModal.isOpen})
    }
    const config = {
        headers: {Authorization: `Bearer ${loginState.token}`}
    };

    function changeState(s) {
        if (s === "WAITING_FOR_RECYCLING") {
            s = "WAITING FOR RECYCLING"
        }
        if(s === "NOT_AVAILABLE"){
            s= "NOT AVAILABLE"
        }
        return s
    }

    const [modalCannotDelete, setModalCannotDelete] = useState(false);
    const [id, setId] = useState(0);
    const [assetName, setAssetName] = useState('');
    const handleDelete = () => {
        console.log(id);
        axios.delete(`https://asset-assignment-be.azurewebsites.net/api/asset/` + id, config)
            .then(
                (response) => {
                    setModalConfirmDelete({...modalConfirmDelete, isOpen: false})
                    toast.success("Delete " + assetName + " successfully");
                    window.location.reload();
                }).catch((error) => {
            console.log(error)
            setModalConfirmDelete({...modalConfirmDelete, isOpen: false})
            if (error.response.data.statusCode === 404) {
                toast.error("This asset not found")
                window.location.reload();
            } else if (error.response.data.statusCode === 405) {
                setModalCannotDelete({...modalCannotDelete, isOpen: true})
            } else {
                toast.error("Delete " + assetName + " failed")
                window.location.reload();
            }
        })
    }
    const onDeleteAsset = (assetId) => {
        console.log(id)
        axios.get(`https://asset-assignment-be.azurewebsites.net/api/asset/` + assetId, config) // thay link
            .then(
                (response) => {
                    if (response.data.assignmentDtoList.length > 0) {
                        setModalCannotDelete({...modalCannotDelete, isOpen: true});
                    } else {
                        setModalConfirmDelete({...modalConfirmDelete, isOpen: true})
                    }
                }).catch((error) => {
            console.log(error)
            setModalConfirmDelete({...modalConfirmDelete, isOpen: false})
            setModalCannotDelete({...modalCannotDelete, isOpen: false});
            if (error.response.data.statusCode === 404) {
                toast.error("This asset not found")
                window.location.reload();
            }
        })
    }
    console.log("aaaa" + props.isLoading)
    //
    // {
    //     props.listFilterState.map(item=>{
    //         console.log(item)
    //     })
    // }

    useEffect(() => {
        if (props.listFilterState === null) {
            setDisplayList([])
        } else {
            setDisplayList(props.listAsset);
        }
    }, [props.listAsset ])

    useEffect(() => {
        if (props.listFilterState !== null) {
            setDisplayList(props.listFilterState);
        } else
            setDisplayList([])

    }, [props.listFilterState])

    console.log("hehehee" + props.checkSearch)


    return (
        <>

            {

                displayList.length === 0 ?
                    props.checkSearch ?
                        <>
                            <div className="data-notfound">
                                <img style={{height: "260px", width: "260px"}}
                                     src={process.env.PUBLIC_URL + '/nodataload.png'}/>
                                <p className="name-notfound">No Result Found</p>
                                <p className="name-notfound-child">Please try again with another</p>
                                <p className="name-notfound-child">keywords or maybe use generic term</p>
                            </div>

                        </>

                        :
                        <>
                            <LoadingOutlined
                                style={{fontSize: "60px", color: "red", textAlign: "center", marginTop: "70px"}}/>
                        </>

                    :
                    <>

                        <tbody>
                        {
                            asset === null ?
                                <></>
                                :
                                <>
                                    {localStorage.removeItem('asset')}
                                    <tr>
                                        <td className="col_asset col_assetCode_asset" onClick={() => {
                                            setModal({...isModal, isOpen: true});
                                            setDataUser(asset)
                                        }}>
                                            <p className="col  assetCode_asset_col">{asset.assetCode}
                                            </p>
                                        </td>
                                        <td className="col_asset col_assetName" onClick={() => {
                                            setModal({...isModal, isOpen: true});
                                            setDataUser(asset)
                                        }}>
                                            <p className="col assetName_col">{asset.assetName}
                                            </p>
                                        </td>
                                        <td className="col_asset col_assetCategory" onClick={() => {
                                            setModal({...isModal, isOpen: true});
                                            setDataUser(asset)
                                        }}>
                                            <p className="col assetCategory_col">{asset.categoryName}
                                            </p>
                                        </td>
                                        {
                                            asset.state === "NOT_AVAILABLE" ?
                                                <td className="col_asset col_state" onClick={() => {
                                                    setModal({...isModal, isOpen: true});
                                                    setDataUser(asset)
                                                }}>
                                                    <p className="col state_col">NOT AVAILABLE</p>
                                                </td>
                                                :
                                                <td className="col_asset col_state" onClick={() => {
                                                    setModal({...isModal, isOpen: true});
                                                    setDataUser(asset)
                                                }}>
                                                    <p className="col state_col">{changeState(asset.state)}</p>
                                                </td>
                                        }
                                        {
                                            asset.state === "ASSIGNED" ?
                                                <>
                                                    <td className="btn_col_assignment edit ant-pagination-disabled">
                                                        <i className="fas fa-pencil-alt"></i>
                                                        <FontAwesomeIcon icon={faPencilAlt}></FontAwesomeIcon>
                                                    </td>
                                                    <td className="btn_col_assignment delete ant-pagination-disabled">
                                                        <CloseCircleOutlined style={{color: "#F3AAAA"}}/>
                                                    </td>

                                                </>
                                                :
                                                <>
                                                    <td className="btn_col_assignment edit" onClick={() => {
                                                        navigate("/asset/editAsset/" + asset.assetId)
                                                    }}>
                                                        <i className="fas fa-pencil-alt"></i>
                                                        <FontAwesomeIcon icon={faPencilAlt}></FontAwesomeIcon>
                                                    </td>
                                                    <td className="btn_col_assignment delete" onClick={() => {
                                                        setId(asset.assetId);
                                                        setAssetName(asset.assetName)
                                                        console.log(id);
                                                        onDeleteAsset(asset.assetId);
                                                    }}>
                                                        <CloseCircleOutlined style={{color: "red"}}/>
                                                    </td>

                                                </>

                                        }
                                    </tr>
                                </>
                        }
                        {

                            displayList.map((item, index) => (
                                <>
                                    {
                                        asset !== null && asset.assetId === item.assetId ?
                                            <></>
                                            :
                                            <tr key={index}>
                                                <td className="col_asset col_assetCode_asset" onClick={() => {
                                                    setModal({...isModal, isOpen: true});
                                                    setDataUser(item)

                                                }}>
                                                    <p className="col  assetCode_asset_col">{item.assetCode}
                                                    </p>
                                                </td>
                                                <td className="col_asset col_assetName" onClick={() => {
                                                    setModal({...isModal, isOpen: true});
                                                    setDataUser(item)

                                                }}>
                                                    <p className="col assetName_col">{item.assetName}
                                                    </p>
                                                </td>
                                                <td className="col_asset col_assetCategory" onClick={() => {
                                                    setModal({...isModal, isOpen: true});
                                                    setDataUser(item)

                                                }}>
                                                    <p className="col assetCategory_col">{item.categoryName}
                                                    </p>
                                                </td>
                                                {
                                                    item.state === "NOT_AVAILABLE" ?
                                                        <td className="col_asset col_state" onClick={() => {
                                                            setModal({...isModal, isOpen: true});
                                                            setDataUser(item)

                                                        }}>
                                                            <p className="col state_col">NOT AVAILABLE</p>
                                                        </td>
                                                        :
                                                        <td className="col_asset col_state" onClick={() => {
                                                            setModal({...isModal, isOpen: true});
                                                            setDataUser(item)

                                                        }}>
                                                            <p className="col state_col">{changeState(item.state)}</p>
                                                        </td>
                                                }
                                                {
                                                    item.state === "ASSIGNED" ?
                                                        <>
                                                            <td className="btn_col_assignment edit ant-pagination-disabled">
                                                                <i className="fas fa-pencil-alt"></i>
                                                                <FontAwesomeIcon icon={faPencilAlt}></FontAwesomeIcon>
                                                            </td>
                                                            <td className="btn_col_assignment delete ant-pagination-disabled">
                                                                <CloseCircleOutlined style={{color: "#F3AAAA"}}/>
                                                            </td>

                                                        </>
                                                        :
                                                        <>
                                                            <td className="btn_col_assignment edit" onClick={() => {
                                                                navigate("/asset/editAsset/" + item.assetId)
                                                            }}>
                                                                <i className="fas fa-pencil-alt"></i>
                                                                <FontAwesomeIcon icon={faPencilAlt}></FontAwesomeIcon>
                                                            </td>
                                                            <td className="btn_col_assignment delete" onClick={() => {
                                                                setId(item.assetId);
                                                                setAssetName(item.assetName)
                                                                console.log(id);
                                                                onDeleteAsset(item.assetId);

                                                            }}>
                                                                <CloseCircleOutlined style={{color: "red"}}/>
                                                            </td>

                                                        </>

                                                }
                                            </tr>
                                    }
                                </>
                            ))
                        }
                        </tbody>
                        {isModal.isOpen ?
                            <div>
                                <ViewInformationAsset isVisible={setIsOpen} dataUser={dataUser}/>
                            </div>

                            :
                            ""
                        }
                    </>
            }

            <Modal
                className="modalConfirm"
                title="Are you sure?"
                visible={modalConfirmDelete.isOpen}
                width={400}
                closable={false}
                onOk={handleDelete}
                onCancel={() => {
                    setModalConfirmDelete({...modalConfirmDelete, isOpen: false})
                }}
                footer={[
                    <Button key="submit" className="buttonSave" onClick={handleDelete}>
                        Delete
                    </Button>,
                    <Button key="cancel" className="buttonCancel" onClick={() => {
                        setModalConfirmDelete({...modalConfirmDelete, isOpen: false})
                    }}>
                        Cancel
                    </Button>
                ]}

            >
                <p>Do you want to delete this asset?</p>
                <br/>
            </Modal>
            <Modal
                className="modalInformation"
                title="Cannot delete asset"
                visible={modalCannotDelete.isOpen}
                width={400}
                closable={true}
                onCancel={() => {
                    setModalCannotDelete({...modalCannotDelete, isOpen: false});
                }}
                footer={[]}
            >
                <p>Cannot delete the asset because it belongs to one or more historical assignments.
                    <br/>
                    If the asset is not able to be used anymore, please update its state in <Button type="link" className= "linkButton" onClick={()=>{navigate("/asset/editAsset/"+id)}}><u>Edit Asset page</u></Button></p>
                <br/>
            </Modal>

        </>
    )
}


export default (TableAsset)