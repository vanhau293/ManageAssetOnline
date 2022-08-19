import React, {useState, useEffect} from "react";
import { Pagination} from "antd";

import {faSearch, faFilter, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import "../../../styles/Styles.css";
import "antd/dist/antd.css";
import TableUser from "./tableUser/TableUser";
import "./ManagerUser.css"
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";
import 'antd/dist/antd.css';
import { useNavigate } from "react-router-dom";
import {LoadingOutlined} from "@ant-design/icons";



export default function ManageUser() {
    const [listUser, setListUser] = useState([]);

    let user = JSON.parse(localStorage.getItem('loginState'));
    const [checked, setChecked] = useState([]);
    const checkList = ["All", "Admin", "Staff"];
    const [listUserFilter, setListUserFilter] = useState([]);
    const [checkFilter, setCheckFilter] = useState(false);
    const [checkSortType, setCheckSort] = useState(false);
    const [listUserSort, setListUserSort] = useState([]);
    const [sort, setSort] = useState({
        name: "",
    });
    const [totalPage, setTotalPage] = useState(0);
    const [state, setState] = useState({
        current: 0,
    });
    const [checkNameSearch, setCheckNameSearch] = useState(false);
    const [nameSearch, setNameSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const config = {
        headers: {Authorization: `Bearer ${user.token}`}
    };
    //get list User location admin and display list  user to page 1


    const getListUser = () => {
        axios
            // .get("https://asset-assignment-be.azurewebsites.net/api/account?page="+ state.current, config)
            .get("https://asset-assignment-be.azurewebsites.net/api/account?page=" + state.current , config)
            .then(function (response) {
                setListUser(response.data.content)
                setTotalPage(response.data.totalPages)
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                setTotalPage(0)

            });
    };
    useEffect(() => {
        getListUser();
    }, []);

    // get list user when admin click type filter

    function getListUserFilter( page,sort,nameSearch,checked) {
        let link ="";
        if(checked.length >1){
            link = "https://asset-assignment-be.azurewebsites.net/api/account?filter=" + "&page=" + page + "&sort=" + sort +"&code=" + nameSearch
        }
        if(checked.length === 1){
            if(checked[0] === "All"){
                link = "https://asset-assignment-be.azurewebsites.net/api/account?filter=" + "&page=" + page + "&sort=" + sort +"&code=" + nameSearch
            }
            else{
                link = "https://asset-assignment-be.azurewebsites.net/api/account?filter=" + checked[0].toLowerCase() + "&page=" + page + "&sort=" + sort +"&code=" + nameSearch
            }
        }
        if(checked.length === 0){
            link = "https://asset-assignment-be.azurewebsites.net/api/account?filter=" + "&page=" + page + "&sort=" + sort +"&code=" + nameSearch
        }
        console.log(link)
        axios
            .get(link, config)
            .then(function (response) {
                if(page===0){
                    setListUserFilter(response.data.content)
                    setTotalPage(response.data.totalPages)
                    setIsLoading(false)
                }else {
                    setListUserFilter(response.data.content)
                    setTotalPage(response.data.totalPages)
                    setIsLoading(false)
                }
            })
            .catch((error) => {
                setListUserFilter([])
                setListUser([])
                setTotalPage(0)
                setIsLoading(false)

            });
    }
    const getListUserSort = (col) => {
        setIsLoading(true)
        setState({
            current: 0,
        });
        console.log("hahaaa")
        switch (col) {
            case 'sa': {
                setSort({...sort, name: "sa"})
                // listCheckSortColumn("sa",nameSearch);
                if(checkNameSearch){
                    getListUserFilter(0,"sa",nameSearch,checked)

                }else{
                    getListUserFilter(0,"sa","",checked)
                    setNameSearch("")
                    setCheckNameSearch(false)
                }
                break;
            }
            case 'sd': {
                setSort({...sort, name: "sd"})
                // listCheckSortColumn("sd",nameSearch);
                if(checkNameSearch){
                    getListUserFilter( 0,"sd",nameSearch,checked)

                }else{
                    getListUserFilter( 0,"sd","",checked)
                    setNameSearch("")
                    setCheckNameSearch(false)
                }
                break;
            }
            case 'ua': {
                setSort({...sort, name: "ua"})
                // listCheckSortColumn("ua",nameSearch);
                if(checkNameSearch){
                    getListUserFilter( 0,"ua",nameSearch,checked)

                }else{
                    getListUserFilter( 0,"ua","",checked)
                    setNameSearch("")
                    setCheckNameSearch(false)
                }
                break;
            }
            case 'ud': {
                setSort({...sort, name: "ud"})
                // listCheckSortColumn("ud",nameSearch);
                if(checkNameSearch){
                    getListUserFilter( 0,"ud",nameSearch,checked)

                }else{
                    getListUserFilter( 0,"ud","",checked)
                    setNameSearch("")
                    setCheckNameSearch(false)
                }
                break;
            }
            case 'fd': {
                setSort({...sort, name: "fd"})
                // listCheckSortColumn("fd",nameSearch);
                if(checkNameSearch){
                    getListUserFilter( 0,"fd",nameSearch,checked)

                }else{
                    getListUserFilter( 0,"fd","",checked)
                    setNameSearch("")
                    setCheckNameSearch(false)
                }
                break;
            }
            case 'fa': {
                setSort({...sort, name: "fa"})
                // listCheckSortColumn("fa",nameSearch);
                if(checkNameSearch){
                    getListUserFilter( 0,"fa",nameSearch,checked)

                }else{
                    getListUserFilter( 0,"fa","",checked)
                    setNameSearch("")
                    setCheckNameSearch(false)
                }
                break;
            }
            case 'ja': {
                setSort({...sort, name: "ja"})
                // listCheckSortColumn("ja",nameSearch);
                if(checkNameSearch){
                    getListUserFilter( 0,"ja",nameSearch,checked)

                }else{
                    getListUserFilter( 0,"ja","",checked)
                    setNameSearch("")
                    setCheckNameSearch(false)
                }
                break;
            }
            case 'jd': {
                setSort({...sort, name: "jd"})
                // listCheckSortColumn("jd",nameSearch);
                if(checkNameSearch){
                    getListUserFilter( 0,"jd",nameSearch,checked)

                }else{
                    getListUserFilter( 0,"jd","",checked)
                    setNameSearch("")
                    setCheckNameSearch(false)
                }
                break;
            }
            default:
                break;
        }
    }
    const handleCheck = (event) => {
        setCheckFilter(true);
        setIsLoading(true)
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

        setNameSearch("")
        setCheckNameSearch(false)
        getListUserFilter( 0,sort.name,"",checked)

    };
    const findListUserSearch = () => {

        setCheckNameSearch(true)
        setIsLoading(true)
        if (nameSearch.length > 20)
            toast.error("Invalid input ");
        else {
            setState({
                current: 0,
            });
            setCheckFilter(true);
            getListUserFilter( 0,sort.name,nameSearch,checked)
        }
    }




    const handleChange = (page) => {
        setIsLoading(true)
        setCheckFilter(true);
        setState({
            current: page,
        });
        let checkpage = 0;
        if (page > 0) {
            checkpage = page - 1;
        }
        if(checkNameSearch){
            getListUserFilter( checkpage,sort.name,nameSearch,checked)
        }else {
            getListUserFilter(checkpage, sort.name, "", checked)
            setNameSearch("")
            setCheckNameSearch(false)
        }
        console.log("is page: " + listUser.length)
    };





    return (
        <>

            <div className="title">
                <h2 style={{color: "red", textAlign: "inherit", fontWeight: "700"}}>User List</h2>
            </div>
            <div className="user-list-toolbar-wrapper">
                <div className="user-list-toolbar">
                    <div className="filter_component filter-section" style={{marginLeft: "25px"}}>
                        <div id="role-filter-section">
                            <div className="dropdown-toggle">
                                <div className="dropdown-header">
                                    <div className="dropdown-title"
                                         style={{textAlign: "left", marginLeft: "10px"}}>Type
                                    </div>
                                    <div className="dropdown-icon" style={{paddingTop: "0.3rem"}}>
                                        <FontAwesomeIcon icon={faFilter}/>
                                    </div>
                                </div>
                                <div className="dropdown-content">
                                    <ul style={{listStyleType: "none"}}>
                                        {checkList.map((item, index) => (
                                            <li key={index}>
                                                <input value={item} type="checkbox" name="role" id={index}
                                                       style={{marginTop: "12px"}}
                                                       onChange={handleCheck}/><label htmlFor={index}
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
                    <div className="search-bar_create-btn_component search_bar-create_btn-wrapper">
                        {
                            <div id="search-section">
                                <input
                                    maxLength="50"
                                    name="keyword"
                                    value={nameSearch || ""}
                                    id="search-query"
                                    onKeyPress={ function handle(e){
                                        if(e.key === "Enter"){
                                            findListUserSearch()
                                        }
                                        return false;
                                    }}
                                    onChange={e => (setNameSearch(e.target.value), setCheckNameSearch(false))}
                                />

                                <button type="button" className="button-search" onClick={findListUserSearch}>
                                    <FontAwesomeIcon icon={faSearch}/></button>
                            </div>
                        }
                        <div id="create-btn-section">
                            <button className="btn-createUser" onClick={() => {
                                navigate("/user/createuser");
                            }}>
                                <p className="btn_create_text"> Create new user</p>
                            </button>
                        </div>
                    </div>
                </div>
                {

                    <div>
                        {
                            !isLoading ?
                                <div className="results-section">
                                    <div className="user_table">
                                        <>
                                            <table>
                                                {
                                                    totalPage === 0 ?
                                                        ""
                                                        :
                                                        <thead>
                                                        <tr>
                                                            <th style={{width:"200px"}} className="col" >
                                                                <p className="col_1 staff_code_col">Staff Code
                                                                    {
                                                                        sort.name === "sa"?
                                                                            <FontAwesomeIcon
                                                                                id="up_Staff"
                                                                                onClick={()=>getListUserSort("sd")}
                                                                                style={{marginLeft: "0.3rem"}}
                                                                                icon={faSortUp}>`
                                                                            </FontAwesomeIcon>
                                                                            :
                                                                            <FontAwesomeIcon
                                                                                id="down_Staff"
                                                                                onClick={()=>getListUserSort("sa")}
                                                                                style={{marginLeft: "0.3rem"}}
                                                                                icon={faSortDown}>`
                                                                            </FontAwesomeIcon>

                                                                    }
                                                                </p>
                                                            </th>
                                                            <th className="col" >
                                                                <p className=" col_1 full_name_col">Full Name
                                                                    {
                                                                        sort.name === "fa"?
                                                                            <FontAwesomeIcon
                                                                                id="up_Fullname"
                                                                                onClick={()=>getListUserSort("fd")}
                                                                                style={{marginLeft: "0.3rem"}}
                                                                                icon={faSortUp}>`
                                                                            </FontAwesomeIcon>
                                                                            :
                                                                            <FontAwesomeIcon
                                                                                id="down_Fullname"
                                                                                onClick={()=>getListUserSort("fa")}
                                                                                style={{marginLeft: "0.3rem"}}
                                                                                icon={faSortDown}>`
                                                                            </FontAwesomeIcon>

                                                                    }
                                                                </p>
                                                            </th>
                                                            <th className="col">
                                                                <p className="col_1 username_col">Username</p>
                                                            </th>
                                                            <th className="col" >
                                                                <p className="col_1 joined_day_col">Joined Date

                                                                    {
                                                                        sort.name === "ja"?
                                                                            <FontAwesomeIcon
                                                                                id="up_JoinedDate"
                                                                                onClick={()=>getListUserSort("jd")}
                                                                                style={{marginLeft: "0.3rem"}}
                                                                                icon={faSortUp}>`
                                                                            </FontAwesomeIcon>
                                                                            :
                                                                            <FontAwesomeIcon
                                                                                id="down_JoinedDate"
                                                                                onClick={()=>getListUserSort("ja")}
                                                                                style={{marginLeft: "0.3rem"}}
                                                                                icon={faSortDown}>`
                                                                            </FontAwesomeIcon>

                                                                    }
                                                                </p>
                                                            </th>
                                                            <th className="col" >
                                                                <p className="col_1 type_col">Type
                                                                    {
                                                                        sort.name === "ua"?
                                                                            <FontAwesomeIcon
                                                                                id="up_Type"
                                                                                onClick={()=>getListUserSort("ud")}
                                                                                style={{marginLeft: "0.3rem"}}
                                                                                icon={faSortUp}>`
                                                                            </FontAwesomeIcon>
                                                                            :
                                                                            <FontAwesomeIcon
                                                                                id="down_Type"
                                                                                onClick={()=>getListUserSort("ua")}
                                                                                style={{marginLeft: "0.3rem"}}
                                                                                icon={faSortDown}>`
                                                                            </FontAwesomeIcon>

                                                                    }
                                                                </p>
                                                            </th>
                                                        </tr>
                                                        </thead>
                                                }
                                                <TableUser
                                                    listUser={listUser}
                                                    listFilter={listUserFilter}
                                                    checkSearch ={checkFilter}
                                                    listSort ={listUserSort}
                                                    checkSort ={checkSortType}
                                                />
                                            </table>
                                        </>
                                    </div>

                                </div>
                                :
                                <LoadingOutlined
                                    style={{fontSize: "60px", color: "red", textAlign: "center", marginTop: "70px"}}/>

                        }

                        {
                            totalPage === 0 ?
                                ""
                                :
                                <>
                                    {
                                        state.current === 0 ?
                                            <Pagination
                                                style={{marginTop: "20px", marginLeft: "70%"}}
                                                nextIcon={"Next"}
                                                prevIcon={"Previous"}
                                                current={state.current + 1}
                                                onChange={handleChange}
                                                total={totalPage * 10}
                                            />
                                            :
                                            <Pagination
                                                style={{marginTop: "20px", marginLeft: "70%"}}
                                                nextIcon={"Next"}
                                                prevIcon={"Previous"}
                                                current={state.current}
                                                onChange={handleChange}
                                                total={totalPage * 10}
                                            />
                                    }
                                </>
                        }

                    </div>
                }
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