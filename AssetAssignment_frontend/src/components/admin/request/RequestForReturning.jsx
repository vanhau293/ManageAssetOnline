
import React, {useState, useEffect} from "react";
import './RequestForReturning.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter, faPencilAlt, faSearch, faSortDown, faSortUp} from "@fortawesome/free-solid-svg-icons";
import {Row, Col, Form, Input, Select, Button, DatePicker, Radio, Cascader} from "antd";
import {Pagination} from "antd";
import "antd/dist/antd.css";
import {CalendarFilled, CloseCircleOutlined, LoadingOutlined, ReloadOutlined} from "@ant-design/icons";
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";
import TableRequest  from "./tableRequest/TableRequest";
export default function RequestForReturning() {
    const checkList = ["All", "Completed", "Waiting for returning"];
    const [state, setState] = useState({
        current: 0,
    });
    const [checkSearch , setCheckSearch] = useState(false)

    const [nameSearch, setNameSearch] = useState("");

    let user = JSON.parse(localStorage.getItem('loginState'));
    const config = {
        headers: {Authorization: `Bearer ${user.token}`}
    };
    const [totalPage, setTotalPage] = useState(0);
    const [listRequest, setListRequest] = useState([]);
    const [listRequestFilter, setListRequestFilter] = useState([]);
    const [listRequestFilterSearch, setListRequestFilterSearch] = useState([]);
    const [date, setDate] = useState("")

    const [checked, setChecked] = useState([]);
    const [checkNameSearch, setCheckNameSearch] = useState(false);
    const [searchDay, setSearchDay] = useState("");
    const [isLoading, setIsLoading] = useState(false);




    const getListRequest = () => {
        axios
            .get("https://asset-assignment-be.azurewebsites.net/api/request", config)
            .then(function (response) {
                setListRequest(response.data)
            })
            .catch((error) => {
                setTotalPage(0)
            });
    };



    function getListRequestToPage(page,nameSearch,checked,searchDay) {
        setCheckSearch(true)
        let link = "";
        let state = "";
        if(checked.length !== 0){
            for (let i=0;i<checked.length;i++){
                if(checked[i] === "All"){
                    state ="";
                    break;
                }
                if (checked[i] === "Waiting for returning"){
                    checked[i] = "Waiting_for_returning"
                }
                state = checked[i].toUpperCase() + "," + state;
            }
        }
        else{
            state = "";
        }
        link = "https://asset-assignment-be.azurewebsites.net/api/request?state=" + state + "&code=" + nameSearch +"&date=" +searchDay
        console.log(link)
        axios
            .get(link, config)
            .then(function (response) {
                setListRequestFilter(response.data)
                console.log(response.data)
                setIsLoading(false)
            })
            .catch((error) => {
                setListRequestFilter([])
                setIsLoading(false)
            });
    }
    function getListAssetToPage(page,nameSearch,searchDay) {
        setIsLoading(true)
        if (checked.length !== 0) {
            if(checkNameSearch) {
                getListRequestToPage(page,nameSearch,checked,searchDay)
            }
            else{
                getListRequestToPage(page,"",checked,searchDay)
                setNameSearch("")
                setCheckNameSearch(false)
            }
        } else {
            getListRequestToPage(page,nameSearch,checked,searchDay)
        }
    }

    const handleCheck = (event) => {
        let updatedList = [...checked];
        if (event.target.checked) {
            checked.push(event.target.value)
            updatedList = [...checked]
        } else {
            checked.splice(checked.indexOf(event.target.value), 1);
            updatedList = [...checked]
        }
        setChecked(updatedList);
        setState({
            current: 0,
        });
        console.log(checked)
        setNameSearch("")
        setCheckNameSearch(false)
        getListAssetToPage(0,"",searchDay);
    };

    const findListRequest= () => {
        setIsLoading(true)
        if (nameSearch.length > 20)
            toast.error("Invalid input ");
        else {
            setState({
                current: 0,
            });
            setCheckNameSearch(true)
            if(checkNameSearch)
                console.log("aaaaaaaa")
            console.log(nameSearch)
            getListRequestToPage(0,nameSearch, checked, date)
        }

    }
    const onChangeDay = (date, dateString) => {
        setIsLoading(true)
        if (date === null) {
            setSearchDay("")
        }
        setSearchDay(dateString)
        getListAssetToPage(0,nameSearch,dateString);

    }
    useEffect(() => {
        getListRequest();
    }, []);






    return (
        <>
            <div className="title">
                <h2 style={{color: "red", textAlign: "inherit", fontWeight: "700"}}>Request List</h2>
            </div>
            <div className="user-list-toolbar-wrapper">
                <div className="user-list-toolbar">
                    <div className="filter_component filter-section-assignemnt" style={{marginLeft: "25px"}}>
                        <div id="role-filter-section">
                            <div className="dropdown-toggle-state">
                                <div className="dropdown-header-state">
                                    <div className="dropdown-title-state"
                                         style={{textAlign: "left", marginLeft: "10px"}}>State
                                    </div>
                                    <div className="dropdown-icon-state" style={{paddingTop: "0.3rem"}}>
                                        <FontAwesomeIcon icon={faFilter}/>
                                    </div>
                                </div>
                                <div className="dropdown-content-request">
                                    <ul style={{listStyleType: "none"}}>
                                        {checkList.map((item, index) => (
                                            <li key={index}>
                                                <input value={item}
                                                       type="checkbox"
                                                       name="role"
                                                       id={index}
                                                       style={{marginTop: "12px"}}
                                                       onChange={handleCheck}
                                                /><label htmlFor={index}
                                                         style={{
                                                             paddingLeft: "10px",
                                                             display: "flex"
                                                         }}> {item}</label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="choice-date" style={{marginRight: "140px"}}>
                        <DatePicker
                            style={{
                                paddingTop: "0",
                                paddingBottom: "0",
                                paddingLeft: "10px",
                                color: "black",
                                border: "0.75px solid #B5B5B5",
                                borderRadius: " 0.2rem",
                                paddingRight: "10px"
                            }}
                            onChange={onChangeDay}

                            suffixIcon={<CalendarFilled
                                style={{color: "black", background: " #d9363e !important"}}/>}
                            format="DD/MM/YYYY"
                            placeholder={"Returned Date"}
                            className="assignedform"
                        />

                    </div>
                    <div className="search-bar_create-btn_component search_bar-create_btn-wrapper">
                        <div id="create-btn-section">
                        </div>
                        <div id="search-section" style={{justifyContent: "left" }}>
                            <input
                                maxLength="50"
                                name="keyword"
                                value={nameSearch || ""}
                                id="search-query"
                                onChange={e => setNameSearch(e.target.value)}
                                onKeyPress={ function handle(e){
                                    if(e.key === "Enter"){
                                        findListRequest()
                                    }
                                    return false;
                                }}
                            />
                            <button type="button" className="button-search"  onClick={findListRequest}>
                                <FontAwesomeIcon icon={faSearch}/></button>
                        </div>
                    </div>

                </div>
                <div>
                    {
                        !isLoading ?
                            <div>
                                <TableRequest listRequest = {listRequest} listRequestFilter={listRequestFilter} checkSearch={checkSearch} searchDay={searchDay}
                                              listRequestFilterSearch={listRequestFilterSearch}/>
                            </div>

                            :
                            <LoadingOutlined
                                style={{fontSize: "60px", color: "red", textAlign: "center", marginTop: "70px"}}/>

                    }




                </div>
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
    );
}