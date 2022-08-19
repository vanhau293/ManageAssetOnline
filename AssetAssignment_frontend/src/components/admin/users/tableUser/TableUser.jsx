import React, {useState, useEffect} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimesCircle, faSortDown, faPencilAlt, faSortUp} from '@fortawesome/free-solid-svg-icons'
import "./TableUser.css"

import Modal from 'antd/lib/modal/Modal';
import DisableUserModal from "../DisableUserModal"
import {
    FilterOutlined,
    EditFilled,
    CloseCircleOutlined,
    LoadingOutlined,
    CloseSquareOutlined
} from "@ant-design/icons";
import ViewInformation from "../viewInformation/ViewInformation";
import {useNavigate} from "react-router-dom";
import axios from 'axios';

function TableUser(props) {
    const [displayList, setDisplayList] = useState(props.listUser);
    const [idAccount, setId] = useState(0);
    const navigate = useNavigate();
    const [dataUser, setDataUser] = useState(false)

    const [isModal, setModal] = useState({
        isOpen: false,
        isLoading: false,
    });
    const [modalCanNotDisable, setModalNotDisable] = useState(false);
    const [modalConfirmDisable, setModalConfirmDisable] = useState({
        isOpen: false,
        isLoading: false,
    });
    const setIsOpen = () => {
        setModal({...isModal, isOpen: !isModal.isOpen})
    }
    const setIsOpenConfirm = () => {
        setModalConfirmDisable({...modalConfirmDisable, isOpen: !modalConfirmDisable.isOpen})
    }
    const loginState = JSON.parse(localStorage.getItem("loginState"));
    const user = JSON.parse(localStorage.getItem("user"));
    const onDisable = (id) => {
        setId(id);
        console.log(idAccount)
        axios.get(`https://asset-assignment-be.azurewebsites.net/api/assignment/`, {
            headers: {Authorization: `Bearer ${loginState.token}`},
            params: {account: id}
        })
            .then(
                (response) => {
                    console.log(response.data.message)
                    setModalConfirmDisable({...modalConfirmDisable, isOpen: true});
                }).catch((error) => {
            if (error.response.data.message === "User not detected") {
                //toast.error(error.response.data.message);
            } else {
                console.log(error)
                setModalNotDisable({...modalCanNotDisable, isOpen: true})
            }
        })
    }



    useEffect(() => {
        if (props.listFilter === null ) {
            setDisplayList([])
        } else {
            setDisplayList(props.listUser);
        }

    }, [props.listUser])
    useEffect(() => {
        if (props.listFilter !== null ) {
            setDisplayList(props.listFilter);
        } else
            setDisplayList([])
    }, [props.listFilter])
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
                                user === null ?
                                <></>
                                :
                                <>
                                {localStorage.removeItem('user')}
                                <tr>
                                    <td className="col staff_code_col"
                                        onClick={() => {
                                            setModal({...isModal, isOpen: true});
                                            setDataUser(user)

                                        }}
                                        >
                                        <p className="col staff_code_col">{user.staffCode}</p>
                                    </td>
                                    <td className="col full_name_col"
                                        onClick={() => {
                                            setModal({...isModal, isOpen: true});
                                            setDataUser(user)}}>
                                        <p className="col full_name_col">{user.firstName + " " + user.lastName}</p>
                                    </td>
                                    <td className="col username_col"
                                        onClick={() => {
                                            setModal({...isModal, isOpen: true});
                                            setDataUser(user)}}>
                                        <p className="col username_col">{user.userName}</p>
                                    </td>
                                    <td className="col joined_day_col"
                                        onClick={() => {
                                            setModal({...isModal, isOpen: true});
                                            setDataUser(user)}}>
                                        <p className="col joined_day_col">{user.joinedDate}</p>
                                    </td>
                                    <td className="col type_col"
                                        onClick={() => {
                                            setModal({...isModal, isOpen: true});
                                            setDataUser(user)}}>
                                        <p className="col type_col">{user.roleName}</p>
                                    </td>
                                    <td className="btn_col pencil" onClick={() => {
                                        navigate("/user/editUser/" + user.accountId);
                                    }}>
                                        <i className="fas fa-pencil-alt"></i>
                                        <FontAwesomeIcon icon={faPencilAlt}></FontAwesomeIcon>
                                    </td>
                                    <td className="btn_col delete">
                                        <FontAwesomeIcon icon={faTimesCircle}
                                                         style={{color: "red"}}
                                                         onClick={() => onDisable(user.accountId)}></FontAwesomeIcon>
                                    </td>
                                </tr>
                                </>
                            }
                        {
                            displayList.map((item, index) => (
                                <>
                                {
                                    user !== null && user.accountId === item.accountId ?
                                    <></>
                                    :
                                    <tr key={index}>
                                    <td className="col staff_code_col"
                                        onClick={() => {
                                            setModal({...isModal, isOpen: true});
                                            setDataUser(item)

                                        }}>
                                        <p className="col staff_code_col">{item.staffCode}</p>
                                    </td>
                                    <td className="col full_name_col"  onClick={() => {
                                        setModal({...isModal, isOpen: true});
                                        setDataUser(item)

                                    }}>
                                        <p className="col full_name_col">{item.firstName + " " + item.lastName}</p>
                                    </td>
                                    <td className="col username_col"  onClick={() => {
                                        setModal({...isModal, isOpen: true});
                                        setDataUser(item)

                                    }}>
                                        <p className="col username_col">{item.userName}</p>
                                    </td>
                                    <td className="col joined_day_col"  onClick={() => {
                                        setModal({...isModal, isOpen: true});
                                        setDataUser(item)

                                    }}>
                                        <p className="col joined_day_col">{item.joinedDate}</p>
                                    </td>
                                    <td className="col type_col"  onClick={() => {
                                        setModal({...isModal, isOpen: true});
                                        setDataUser(item)

                                    }}>
                                        <p className="col type_col">{item.roleName}</p>
                                    </td>
                                    <td className="btn_col pencil" onClick={() => {
                                        navigate("/user/editUser/" + item.accountId);
                                    }}>
                                        <i className="fas fa-pencil-alt"></i>
                                        <FontAwesomeIcon icon={faPencilAlt}></FontAwesomeIcon>
                                    </td>
                                    <td className="btn_col delete">
                                        <FontAwesomeIcon icon={faTimesCircle}
                                                         style={{color: "red"}}
                                                         onClick={() => onDisable(item.accountId)}></FontAwesomeIcon>
                                    </td>
                                </tr>
                            }
                                
                            </>
                        ))}
                        </tbody>

                    </>
            }
            {isModal.isOpen ?
                <div>
                    <ViewInformation isVisible={setIsOpen} dataUser={dataUser}/>
                </div>

                :
                ""
            }
            <Modal
                className="modalInformation"
                title="Can not disable user"
                visible={modalCanNotDisable.isOpen}
                width={400}
                closable={true}
                onCancel={() => {
                    setModalNotDisable({...modalCanNotDisable, isOpen: false});
                }}
                footer={[]}
            >
                <p>There are valid assignments belonging to this user. Please close all assignments before disabling
                    user.</p>
                <br/>
            </Modal>
            {modalConfirmDisable.isOpen ? <DisableUserModal setIsOpen={setIsOpenConfirm} id={idAccount}/> : ""}
            {/*<ViewInformation isVisible ={viewInformation}/>*/}
        </>
    )
}


export default (TableUser)