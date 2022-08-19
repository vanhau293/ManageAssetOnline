import React, {useState, useEffect} from "react";
import './ManageAssignment.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter, faPencilAlt, faSearch, faSortDown, faSortUp} from "@fortawesome/free-solid-svg-icons";
import {Row, Col, Form, Input, Select, Button, DatePicker, Radio, Cascader} from "antd";
import {Pagination} from "antd";
import "antd/dist/antd.css";
import {CalendarFilled, CloseCircleOutlined, ReloadOutlined} from "@ant-design/icons";
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";
import TableAssignment from "./tableAssignments/TableAssignment";
import { useNavigate } from "react-router-dom";

export default function ManageAssignment() {
    const checkList = ["All", "Accepted", "Decline", "Waiting for acceptance"];
    const [isLoading, setLoading] = useState({isLoading: false});
    const {Option} = Select;
    const [form] = Form.useForm();
    const [state, setState] = useState({
        current: 0,
    });
    const [listAssignment, setListAssignment] = useState([]);
    const [sort, setSort] = useState({
        name: "",
    });
    const [nameSearch, setNameSearch] = useState("");
    const [searchDay, setSearchDay] = useState("");

    let user = JSON.parse(localStorage.getItem('loginState'));
    const config = {
        headers: {Authorization: `Bearer ${user.token}`}
    };
    const navigate = useNavigate();
    const [checked, setChecked] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [listAssignmentSort, setListAssignmentSort] = useState([]);
    const [listAssigmnetFilter, setListAssigmnetFilter] = useState([]);
    const [checkFilter, setCheckFilter] = useState(false);


    const getListAssignment = () => {
        axios
            // .get("http://localhost:8080/api/assignment/list?fl1=ACCEPTED&fl2=WAITING_FOR_ACCEPTANCE&fl3=ACCEPTED", config)
            .get("https://asset-assignment-be.azurewebsites.net/api/assignment/list?fl1=ACCEPTED&fl2=WAITING_FOR_ACCEPTANCE&fl3=ACCEPTED", config)
            .then(function (response) {
                setListAssignment(response.data.content)
                setTotalPage(response.data.totalPages)

            })
            .catch((error) => {
                setTotalPage(0)
            });
    };

    useEffect(() => {
        getListAssignment();
    }, []);

    function getListAssignmentFilter(checked, page, sort, searchDay, nameSearch) {
        for (let i = 0; i < checked.length; i++) {
            if (checked[i] === "Waiting for acceptance")
                checked[i] = "Waiting_for_acceptance"
        }
        let link = "";
        if (checked.length !== 0) {
            if (checked.length === 1) {
                if (checked[0] === "Accepted") {
                    link = "https://asset-assignment-be.azurewebsites.net/api/assignment/list?fl1=ACCEPTED&fl2=ACCEPTED&fl3=ACCEPTED&page=" + page + "&sort=" + sort + "&d=" + searchDay + "&code=" + nameSearch;
                    // link = "http://localhost:8080/api/assignment/list?fl1=ACCEPTED&fl2=ACCEPTED&fl3=ACCEPTED&page=" + page + "&sort=" + sort + "&d=" + searchDay + "&code=" + nameSearch;
                } else if (checked[0] === "Decline") {
                    link = "https://asset-assignment-be.azurewebsites.net/api/assignment/list?fl1=DECLINE&fl2=DECLINE&fl3=DECLINE&page=" + page + "&sort=" + sort + "&d=" + searchDay + "&code=" + nameSearch;
                    // link = "http://localhost:8080/api/assignment/list?fl1=DECLINE&fl2=DECLINE&fl3=DECLINE&page=" + page + "&sort=" + sort + "&d=" + searchDay + "&code=" + nameSearch;
                } else if (checked[0] === "Waiting_for_acceptance") {
                    link = "https://asset-assignment-be.azurewebsites.net/api/assignment/list?fl1=WAITING_FOR_ACCEPTANCE&fl2=WAITING_FOR_ACCEPTANCE&fl3=WAITING_FOR_ACCEPTANCE&page=" + page + "&sort=" + sort + "&d=" + searchDay + "&code=" + nameSearch

                    // link = "http://localhost:8080/api/assignment/list?fl1=WAITING_FOR_ACCEPTANCE&fl2=WAITING_FOR_ACCEPTANCE&fl3=WAITING_FOR_ACCEPTANCE&page=" + page + "&sort=" + sort + "&d=" + searchDay + "&code=" + nameSearch
                } else {
                    link = "https://asset-assignment-be.azurewebsites.net/api/assignment/list?fl1=WAITING_FOR_ACCEPTANCE&fl2=DECLINE&fl3=ACCEPTED&page=" + page + "&sort=" + sort + "&d=" + searchDay + "&code=" + nameSearch

                    // link = "http://localhost:8080/api/assignment/list?fl1=WAITING_FOR_ACCEPTANCE&fl2=DECLINE&fl3=ACCEPTED&page=" + page + "&sort=" + sort + "&d=" + searchDay + "&code=" + nameSearch
                }
            } else if (checked.length === 2) {
                if (checked[0] === "All" || checked[1] === "All") {
                    link = "https://asset-assignment-be.azurewebsites.net/api/assignment/list?fl1=WAITING_FOR_ACCEPTANCE&fl2=DECLINE&fl3=ACCEPTED&page=" + page + "&sort=" + sort + "&d=" + searchDay + "&code=" + nameSearch

                    // link = "http://localhost:8080/api/assignment/list?fl1=WAITING_FOR_ACCEPTANCE&fl2=DECLINE&fl3=ACCEPTED&page=" + page + "&sort=" + sort + "&d=" + searchDay + "&code=" + nameSearch

                }else {
                    link = "https://asset-assignment-be.azurewebsites.net/api/assignment/list?fl1=" + checked[0].toUpperCase() + "&fl2=" + checked[0].toUpperCase() + "&fl3=" + checked[1].toUpperCase() + "&page=" + page + "&sort=" + sort + "&d=" + searchDay + "&code=" + nameSearch

                    // link = "http://localhost:8080/api/assignment/list?fl1=" + checked[0].toUpperCase() + "&fl2=" + checked[0].toUpperCase() + "&fl3=" + checked[1].toUpperCase() + "&page=" + page + "&sort=" + sort + "&d=" + searchDay + "&code=" + nameSearch
                }
            } else {
                link = "https://asset-assignment-be.azurewebsites.net/api/assignment/list?fl1=ACCEPTED&fl2=DECLINE&fl3=WAITING_FOR_ACCEPTANCE&page=" + page + "&sort=" + sort + "&d=" + searchDay + "&code=" + nameSearch

                // link = "http://localhost:8080/api/assignment/list?fl1=ACCEPTED&fl2=DECLINE&fl3=WAITING_FOR_ACCEPTANCE&page=" + page + "&sort=" + sort + "&d=" + searchDay + "&code=" + nameSearch
            }
        } else {
            link = "https://asset-assignment-be.azurewebsites.net/api/assignment/list?fl1=ACCEPTED&fl2=ACCEPTED&fl3=WAITING_FOR_ACCEPTANCE&page=" + page + "&sort=" + sort + "&d=" + searchDay + "&code=" + nameSearch
            // link = "http://localhost:8080/api/assignment/list?fl1=ACCEPTED&fl2=ACCEPTED&fl3=WAITING_FOR_ACCEPTANCE&page=" + page + "&sort=" + sort + "&d=" + searchDay + "&code=" + nameSearch
        }

        axios
            .get(link, config)
            .then(function (response) {
                if (page === 0) {
                    setListAssigmnetFilter(response.data.content)
                    setTotalPage(response.data.totalPages)
                } else {
                    setListAssigmnetFilter(response.data.content)
                    setTotalPage(response.data.totalPages)
                }
            })
            .catch((error) => {
                setListAssigmnetFilter([])
                setTotalPage(0)

            });
    }

    function findListAssignmentToSort(page, sort, type1, type2, type3, day, namesearch, searchDay) {
        let link = "";
        if (type1 === null && type2 === null && type3 === null && day === null && namesearch === null) {
            // link = "http://localhost:8080/api/assignment/list?fl1=ACCEPTED&fl2=WAITING_FOR_ACCEPTANCE&fl3=ACCEPTED&sort=" + sort + "&page=" + page + "&d=" + searchDay;

            link = "https://asset-assignment-be.azurewebsites.net/api/assignment/list?fl1=ACCEPTED&fl2=WAITING_FOR_ACCEPTANCE&fl3=ACCEPTED&sort=" + sort + "&page=" + page + "&d=" + searchDay;
        }
        else if (namesearch !== null && type1 === null && type2 === null && type3 === null && day === null) {
            // link = "http://localhost:8080/api/assignment/list?fl1=ACCEPTED&fl2=WAITING_FOR_ACCEPTANCE&fl3=ACCEPTED&sort=" + sort + "&page=" + page + "&code=" + namesearch + "&d=" + searchDay

            link = "https://asset-assignment-be.azurewebsites.net/api/assignment/list?fl1=ACCEPTED&fl2=WAITING_FOR_ACCEPTANCE&fl3=ACCEPTED&sort=" + sort + "&page=" + page + "&code=" + namesearch + "&d=" + searchDay

        }else {
            // link = "http://localhost:8080/api/assignment/list?fl1=ACCEPTED&fl2=WAITING_FOR_ACCEPTANCE&fl3=ACCEPTED&sort=" + sort + "&page=" + page + "&d=" + searchDay

            link = "https://asset-assignment-be.azurewebsites.net/api/assignment/list?fl1=ACCEPTED&fl2=WAITING_FOR_ACCEPTANCE&fl3=ACCEPTED&sort=" + sort + "&page=" + page + "&d=" + searchDay
        }
            axios
            .get(link, config)
            .then(function (response) {
                setListAssignmentSort(response.data.content)
                setTotalPage(response.data.totalPages)
            })
            .catch((error) => {
                setListAssignmentSort([])
                setTotalPage(0)
            });
    }

    function listCheckSortColumn(name, search_name) {
        setState({
            current: 0,
        });
        if (checked.length !== 0) {

            getListAssignmentFilter(checked, 0, name, searchDay, nameSearch)
        } else {
            findListAssignmentToSort(0, name, null, null, null, null, nameSearch, searchDay, nameSearch)
        }

    }

    const getListAssignmentSort = (col) => {
        switch (col) {
            case 'aa': {
                setSort({...sort, name: "aa"})
                listCheckSortColumn("aa", nameSearch);
                break;
            }
            case 'ad': {
                setSort({...sort, name: "ad"})
                listCheckSortColumn("ad", nameSearch);
                break;
            }
            case 'ca': {
                setSort({...sort, name: "ca"})
                listCheckSortColumn("ca", nameSearch);
                break;
            }
            case 'cd': {
                setSort({...sort, name: "cd"})
                listCheckSortColumn("cd", nameSearch);
                break;
            }
            case 'nd': {
                setSort({...sort, name: "nd"})
                listCheckSortColumn("nd", nameSearch);
                break;
            }
            case 'na': {
                setSort({...sort, name: "na"})
                listCheckSortColumn("na", nameSearch);
                break;
            }
            case 'td': {
                setSort({...sort, name: "td"})
                listCheckSortColumn("td", nameSearch);
                break;
            }
            case 'ta': {
                setSort({...sort, name: "ta"})
                listCheckSortColumn("ta", nameSearch);
                break;
            }
            case 'bd': {
                setSort({...sort, name: "bd"})
                listCheckSortColumn("bd", nameSearch);
                break;
            }
            case 'ba': {
                setSort({...sort, name: "ba"})
                listCheckSortColumn("ba", nameSearch);
                break;
            }
            case 'dd': {
                setSort({...sort, name: "dd"})
                listCheckSortColumn("dd", nameSearch);
                break;
            }
            case 'da': {
                setSort({...sort, name: "da"})
                listCheckSortColumn("da", nameSearch);
                break;
            }
            case 'ed': {
                setSort({...sort, name: "ed"})
                listCheckSortColumn("ed", nameSearch);
                break;
            }
            case 'ea': {
                setSort({...sort, name: "ea"})
                listCheckSortColumn("ea", nameSearch);
                break;
            }
            default:
                break;
        }
    }


    function getListAssignmentPageNoFilter(page, sort, searchDay, nameSearch) {
        axios
            .get("https://asset-assignment-be.azurewebsites.net/api/assignment/list?page=" + page + "&sort=" + sort + "&fl1=ACCEPTED&fl2=WAITING_FOR_ACCEPTANCE&fl3=ACCEPTED" + "&d=" + searchDay + "&code=" + nameSearch, config)

            // .get("http://localhost:8080/api/assignment/list?page=" + page + "&sort=" + sort + "&fl1=ACCEPTED&fl2=WAITING_FOR_ACCEPTANCE&fl3=ACCEPTED" + "&d=" + searchDay + "&code=" + nameSearch, config)
            .then(function (response) {
                setListAssignment(response.data.content)
                setTotalPage(response.data.totalPages)
            })
            .catch((error) => {
                setListAssignment([])
                setTotalPage(0)

            });
    }

    function getListAssignmnetToPage(page,nameSearch) {
        setCheckFilter(true)
        if (checked.length !== 0) {
            getListAssignmentFilter(checked, page, sort.name, searchDay, nameSearch)
        } else {
            getListAssignmentPageNoFilter(page, sort.name, searchDay, nameSearch);
        }
    }

    const handleCheck = (event) => {
        setCheckFilter(true)
        setNameSearch("")
        let updatedList = [...checked];
        if (event.target.checked) {
            if (event.target.checked === "Waiting for acceptance")
                checked.push("Waiting_for_acceptance")
            else {
                checked.push(event.target.value)
            }
            updatedList = [...checked]
        } else {
            checked.splice(checked.indexOf(event.target.value), 1);
            updatedList = [...checked]
        }
        setState({
            current: 0,
        });
        setChecked(updatedList);
        setNameSearch("")
        getListAssignmnetToPage(0,"")

    };

    const handleChange = (page) => {
        setCheckFilter(true)
        setState({
            current: page,
        });
        let checkpage = 0;
        if (page > 0) {
            checkpage = page - 1;
        }
        getListAssignmnetToPage(checkpage,nameSearch)
    };

    const onChangeDay = (date, dateString) => {
        if (date === null) {
            setCheckFilter(true)
            setSearchDay("")
            if (checked.length !== 0) {
                getListAssignmentFilter(checked, 0, sort.name, "", nameSearch)
            } else {
                getListAssignmentPageNoFilter(0, sort.name, "", nameSearch);
            }
        }
        setCheckFilter(true)
        setSearchDay(dateString)
        if (checked.length !== 0) {
            getListAssignmentFilter(checked, 0, sort.name, dateString, nameSearch)
        } else {
            getListAssignmentPageNoFilter(0, sort.name, dateString, nameSearch);
        }

    }
    const findListAssigmentSearch = () => {
        setCheckFilter(true)
        if (nameSearch.length > 20)
            toast.error("Invalid input ");
        else {
            setState({
                current: 0,
            });
            setCheckFilter(true)
            if (checked.length !== 0) {
                getListAssignmentFilter(checked, 0, sort.name, searchDay, nameSearch)
            } else {
                getListAssignmentPageNoFilter(0, sort.name, searchDay, nameSearch);
            }
        }
    }


    return (
        <>
            <div className="title">
                <h2 style={{color: "red", textAlign: "inherit", fontWeight: "700"}}>Assignment List</h2>
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
                                <div className="dropdown-content-assignment">
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
                            onChange={onChangeDay}
                            style={{
                                paddingTop: "0",
                                paddingBottom: "0",
                                paddingLeft: "10px",
                                color: "black",
                                border: "0.75px solid #B5B5B5",
                                borderRadius: " 0.2rem",
                                paddingRight: "10px"
                            }}
                            suffixIcon={<CalendarFilled
                                style={{color: "black", background: " #d9363e !important"}}/>}
                            format="DD/MM/YYYY"
                            placeholder={"Assigned Date"}
                            className="assignedform"
                        />



                    </div>
                    <div className="search-bar_create-btn_component search_bar-create_btn-wrapper">
                        <div id="search-section">
                            <input
                                maxLength="50"
                                name="keyword"
                                value={nameSearch || ""}
                                id="search-query"
                                onChange={e => setNameSearch(e.target.value)}
                                onKeyPress={ function handle(e){
                                    if(e.key === "Enter"){
                                        findListAssigmentSearch()
                                    }
                                    return false;
                                }}
                            />

                            <button type="button" className="button-search" onClick={findListAssigmentSearch}>
                                <FontAwesomeIcon icon={faSearch}/></button>
                        </div>
                        <div id="create-btn-section">
                            <button className="btn-createUser" onClick={()=>{
                                    navigate("/assignment/createAssignment");
                            }}>
                                <p className="btn_create_text"> Create new assignment</p>
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <div className="results-section">
                            <div className="Assignment_table">
                                <>
                                    <table>
                                        {
                                            totalPage === 0 ?
                                                ""
                                                :
                                                <thead>
                                                <tr>
                                                    <th className="col_assignment col_no">
                                                        <p className="col_1 no_col">No
                                                            {
                                                                sort.name === "ad" ?
                                                                    <FontAwesomeIcon
                                                                        id="up_No"
                                                                        onClick={() => getListAssignmentSort("aa")}
                                                                        style={{marginLeft: "0.3rem"}}
                                                                        icon={faSortUp}>`
                                                                    </FontAwesomeIcon>
                                                                    :
                                                                    <FontAwesomeIcon
                                                                        id="down_No"
                                                                        onClick={() => getListAssignmentSort("ad")}
                                                                        style={{marginLeft: "0.3rem"}}
                                                                        icon={faSortDown}>`
                                                                    </FontAwesomeIcon>

                                                            }
                                                        </p>
                                                    </th>
                                                    <th className="col_assignment col_assetCode">
                                                        <p className="col_1 asset_code_col">Asset Code
                                                            {
                                                                sort.name === "cd" ?
                                                                    <FontAwesomeIcon
                                                                        id="up_Assetcode"
                                                                        onClick={() => getListAssignmentSort("ca")}
                                                                        style={{marginLeft: "0.3rem"}}
                                                                        icon={faSortUp}>`
                                                                    </FontAwesomeIcon>
                                                                    :
                                                                    <FontAwesomeIcon
                                                                        id="down_Assetcode"
                                                                        onClick={() => getListAssignmentSort("cd")}
                                                                        style={{marginLeft: "0.3rem"}}
                                                                        icon={faSortDown}>`
                                                                    </FontAwesomeIcon>

                                                            }
                                                        </p>
                                                    </th>
                                                    <th className="col_assignment col_assetName">
                                                        <p className="asset_name_col">Asset Name
                                                            {
                                                                sort.name === "nd" ?
                                                                    <FontAwesomeIcon
                                                                        id="up_Assetname"
                                                                        onClick={() => getListAssignmentSort("na")}
                                                                        style={{marginLeft: "0.3rem"}}
                                                                        icon={faSortUp}>`
                                                                    </FontAwesomeIcon>
                                                                    :
                                                                    <FontAwesomeIcon
                                                                        id="down_Assetname"
                                                                        onClick={() => getListAssignmentSort("nd")}
                                                                        style={{marginLeft: "0.3rem"}}
                                                                        icon={faSortDown}>`
                                                                    </FontAwesomeIcon>

                                                            }
                                                        </p>
                                                    </th>
                                                    <th className="col_assignment col_assignedTo">
                                                        <p className="assigned_to_col">Assigned to
                                                            {
                                                                sort.name === "td" ?
                                                                    <FontAwesomeIcon
                                                                        id="up_Assignedto"
                                                                        onClick={() => getListAssignmentSort("ta")}
                                                                        style={{marginLeft: "0.3rem"}}
                                                                        icon={faSortUp}>`
                                                                    </FontAwesomeIcon>
                                                                    :
                                                                    <FontAwesomeIcon
                                                                        id="down_Assignedto"
                                                                        onClick={() => getListAssignmentSort("td")}
                                                                        style={{marginLeft: "0.3rem"}}
                                                                        icon={faSortDown}>`
                                                                    </FontAwesomeIcon>

                                                            }</p>
                                                    </th>
                                                    <th className="col_assignment col_assignmentBy">
                                                        <p className="assigned_by_col">Assigned by
                                                            {
                                                                sort.name === "bd" ?
                                                                    <FontAwesomeIcon
                                                                        id="up_Assignedby"
                                                                        onClick={() => getListAssignmentSort("ba")}
                                                                        style={{marginLeft: "0.3rem"}}
                                                                        icon={faSortUp}>`
                                                                    </FontAwesomeIcon>
                                                                    :
                                                                    <FontAwesomeIcon
                                                                        id="down_Assignedby"
                                                                        onClick={() => getListAssignmentSort("bd")}
                                                                        style={{marginLeft: "0.3rem"}}
                                                                        icon={faSortDown}>`
                                                                    </FontAwesomeIcon>

                                                            }
                                                        </p>
                                                    </th>
                                                    <th className="col_assignment col_assignmentDate">
                                                        <p className="assigned_date_col">Assigned Date
                                                            {
                                                                sort.name === "dd" ?
                                                                    <FontAwesomeIcon
                                                                        id="up_AssignedDate"
                                                                        onClick={() => getListAssignmentSort("da")}
                                                                        style={{marginLeft: "0.3rem"}}
                                                                        icon={faSortUp}>`
                                                                    </FontAwesomeIcon>
                                                                    :
                                                                    <FontAwesomeIcon
                                                                        id="down_AssignedDate"
                                                                        onClick={() => getListAssignmentSort("dd")}
                                                                        style={{marginLeft: "0.3rem"}}
                                                                        icon={faSortDown}>`
                                                                    </FontAwesomeIcon>

                                                            }
                                                        </p>
                                                    </th>
                                                    <th className="col_assignment col_state">
                                                        <p className="state_col">State
                                                            {
                                                                sort.name === "ed" ?
                                                                    <FontAwesomeIcon
                                                                        id="up_State"
                                                                        onClick={() => getListAssignmentSort("ea")}
                                                                        style={{marginLeft: "0.3rem"}}
                                                                        icon={faSortUp}>`
                                                                    </FontAwesomeIcon>
                                                                    :
                                                                    <FontAwesomeIcon
                                                                        id="down_State"
                                                                        onClick={() => getListAssignmentSort("ed")}
                                                                        style={{marginLeft: "0.3rem"}}
                                                                        icon={faSortDown}>`
                                                                    </FontAwesomeIcon>

                                                            }
                                                        </p>
                                                    </th>
                                                </tr>
                                                </thead>
                                        }
                                        <TableAssignment listAssignment={listAssignment} listSort={listAssignmentSort}
                                                         listFilter={listAssigmnetFilter}
                                                         checkSearch ={checkFilter}/>

                                    </table>

                                </>
                            </div>

                        </div>
                    </div>
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