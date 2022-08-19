import React, {useState, useEffect} from "react";
import {Pagination} from "antd";

import {faSearch, faFilter, faSortDown, faSortUp} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import "../../../styles/Styles.css";
import "antd/dist/antd.css";
import TableAssets from "./tableAssets/TableAssets";
import "./ManageAsset.css"
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";
import 'antd/dist/antd.css';
import {useNavigate} from "react-router-dom";
import {LoadingOutlined} from "@ant-design/icons";


export default function ManageAsset() {
    let user = JSON.parse(localStorage.getItem('loginState'));
    const listState = ["All", "Assigned", "Available", "Not available", "Waiting for recycling", "Recycled"];
    const [listAssetFilter, setListAssetFilter] = useState([]);

    const [totalPage, setTotalPage] = useState(0);
    const [listCategory, setListCategory] = useState([])
    const [sort, setSort] = useState({
        name: "",
    });
    const [checked, setChecked] = useState([]);
    const [checkedCategory, setCheckedCategory] = useState([]);
    const [checkFilter, setCheckFilter] = useState(false);
    const [checkNameSearch, setCheckNameSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const [nameSearch, setNameSearch] = useState("");

    const [listAsset, setListAsset] = useState([]);
    const [state, setState] = useState({
        current: 0,
    });
    const navigate = useNavigate();
    const config = {
        headers: {Authorization: `Bearer ${user.token}`}
    };

    const getListCategory = () => {
        axios
            .get("https://asset-assignment-be.azurewebsites.net/api/category", config)
            // .get("http://localhost:8080/api/category", config)

            .then(function (response) {
                console.log(response.data)
                setListCategory(response.data)
                setNameSearch("");

            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };
    const getListAsset = () => {
        axios
            .get("https://asset-assignment-be.azurewebsites.net/api/asset?state=AVAILABLE,NOT_AVAILABLE,ASSIGNED", config)
            // .get("http://localhost:8080/api/asset?state=AVAILABLE,NOT_AVAILABLE,ASSIGNED", config)

            .then(function (response) {
                console.log(response.data)
                setListAsset(response.data.content)
                console.log("Page "+ response.data.totalPages)
                setTotalPage(response.data.totalPages)

            })
            .catch((error) => {
                toast.error(error.response.data.message);
                setTotalPage(0)
                setIsLoading(false)

            });
    };
    function getListAssetFilterState(checked, page, sort, nameSearch) {
        console.log("hehee")
        let link = "";
        let state = "";
        let category ="";
        if(checked.length !== 0){
            for (let i=0;i<checked.length;i++){
                if(checked[i]==="All"){
                    state="ASSIGNED,AVAILABLE,NOT_AVAILABLE,WAITING_FOR_RECYCLING,RECYCLED"
                    break;
                }
                if(checked[i] === "Not available")
                    state = state + "NOT_AVAILABLE,";
                if(checked[i] === "Waiting for recycling")
                    state = state + "WAITING_FOR_RECYCLING,";
                if(checked[i] === "Assigned")
                    state = state + "ASSIGNED,";
                if(checked[i] === "Recycled")
                    state = state + "RECYCLED,";
                if(checked[i] === "Available")
                    state = state + "AVAILABLE,";
            }
        }
        else{
            state = "AVAILABLE,NOT_AVAILABLE,ASSIGNED";
        }
        if(checkedCategory.length !== 0){
            for (let i=0;i<checkedCategory.length;i++){
                if(checkedCategory[i] === "All") {
                    category = "";
                    break;
                }
                listCategory.map(item=>{
                    if(item.categoryName === checkedCategory[i]){
                        category = category + item.categoryId + ",";
                    }
                })
            }
        }
        console.log(category)


        link = "https://asset-assignment-be.azurewebsites.net/api/asset?state=" + state + "&sort=" + sort + "&page=" + page + "&code=" + nameSearch + "&category=" + category
        // link = "http://localhost:8080/api/asset?state=" + state + "&sort=" + sort + "&page=" + page + "&code=" + nameSearch + "&category=" + category
        console.log(link)
        axios
            .get(link, config)
            .then(function (response) {
                if (page === 0) {
                    setListAssetFilter(response.data.content)
                    console.log(response.data.content)
                    setTotalPage(response.data.totalPages)
                    setIsLoading(false)   // Hide loading screen
                } else {
                    setListAssetFilter(response.data.content)
                    setTotalPage(response.data.totalPages)
                    console.log(response.data.content)
                    setIsLoading(false)   // Hide loading screen
                }
            })
            .catch((error) => {
                console.log("hihih")
                setListAssetFilter([])
                setTotalPage(0)
                setIsLoading(false)


            });
    }
    const getListAssetSort = (col) => {
        setState({
            current: 0,
        });
        switch (col) {
            case 'ca': {
                setIsLoading(true)
                setSort({...sort, name: "ca"})
                if(checkNameSearch){
                    getListAssetFilterState(checked, 0, "ca", nameSearch)

                }else{
                    getListAssetFilterState(checked, 0, "ca", "")
                    setNameSearch("")
                    setCheckNameSearch(false)

                }
                break;
            }
            case 'cd': {
                setIsLoading(true)

                setSort({...sort, name: "cd"})
                if(checkNameSearch) {
                    getListAssetFilterState(checked, 0, "cd", nameSearch)
                }
                else{
                    getListAssetFilterState(checked, 0, "cd", "")
                    setNameSearch("")
                    setCheckNameSearch(false)

                }
                break;
            }
            case 'na': {
                setIsLoading(true)

                setSort({...sort, name: "na"})
                if(checkNameSearch){
                    getListAssetFilterState(checked, 0, "na", nameSearch)
                }else{
                    getListAssetFilterState(checked, 0, "na", "")
                    setNameSearch("")
                    setCheckNameSearch(false)
                }
                break;
            }
            case 'nd': {
                setIsLoading(true)

                setSort({...sort, name: "nd"})
                if(checkNameSearch){
                    getListAssetFilterState(checked, 0, "nd", nameSearch)

                }else{
                    getListAssetFilterState(checked, 0, "nd", "")
                    setNameSearch("")
                    setCheckNameSearch(false)
                }
                break;
            }
            case 'ed': {
                setIsLoading(true)

                setSort({...sort, name: "ed"})
                if(checkNameSearch){
                    getListAssetFilterState(checked, 0, "ed", nameSearch)

                }else{
                    getListAssetFilterState(checked, 0, "ed", "")

                    setNameSearch("")
                    setCheckNameSearch(false)
                }
                break;
            }
            case 'ea': {
                setIsLoading(true)

                setSort({...sort, name: "ea"})
                if(checkNameSearch){
                    getListAssetFilterState(checked, 0, "ea", nameSearch)

                }else{
                    getListAssetFilterState(checked, 0, "ea", "")
                    setNameSearch("")
                    setCheckNameSearch(false)
                }
                break;
            }
            case 'sd': {
                setIsLoading(true)

                setSort({...sort, name: "sd"})
                if(checkNameSearch){
                    getListAssetFilterState(checked, 0, "sd", nameSearch)

                }else{
                    getListAssetFilterState(checked, 0, "sd", "")
                    setNameSearch("")
                    setCheckNameSearch(false)
                }
                break;
            }
            case 'sa': {
                setIsLoading(true)

                setSort({...sort, name: "sa"})
                if(checkNameSearch){
                    getListAssetFilterState(checked, 0, "sa", nameSearch)

                }else{
                    getListAssetFilterState(checked, 0, "sa", "")
                    setNameSearch("")
                    setCheckNameSearch(false)
                }
                break;
            }
            default:
                break;
        }
    }


    useEffect(() => {
        getListCategory();
        getListAsset();
    }, []);



    const handleChange = (page) => {
        setCheckFilter(true)
        setIsLoading(true)
        setState({
            current: page,
        });
        let checkpage = 0;
        if (page > 0) {
            checkpage = page - 1;
        }
        if(checkNameSearch){
            getListAssetFilterState(checked, checkpage, sort.name, nameSearch)
        }else{
            getListAssetFilterState(checked, checkpage, sort.name, "")
            setNameSearch("")
            setCheckNameSearch(false)
        }
    };
    function getListAssetToPage(page,nameSearch) {
        if (checked.length !== 0 || checkedCategory.length !== 0) {
            if(checkNameSearch) {
                getListAssetFilterState(checked, page, sort.name, nameSearch)
            }
            else{
                getListAssetFilterState(checked, page, sort.name, "")
                setNameSearch("")
                setCheckNameSearch(false)
            }
        } else {
            getListAssetFilterState(checked,0,sort.name,nameSearch)
        }
    }

    const handleCheck = (event) => {
        setCheckFilter(true)
        setIsLoading(true)   // Hide loading screen
        setNameSearch("")
        let updatedList = [...checked];
        if (event.target.checked) {
            checked.push(event.target.value)
            updatedList = [...checked]
        } else {
            checked.splice(checked.indexOf(event.target.value), 1);
            updatedList = [...checked]
        }
        console.log(checked);
        setState({
            current: 0,
        });
        setNameSearch("")
        setCheckNameSearch(false)
        getListAssetToPage(0,"")

    };

    const findListAsset= () => {
        setIsLoading(true)
        if (nameSearch.length > 20)
            toast.error("Invalid input ");
        else {
            setState({
                current: 0,
            });
            setCheckFilter(true)
            setCheckNameSearch(true)
            if(checkNameSearch)
                console.log("aaaaaaaa")
            console.log(nameSearch)
            getListAssetFilterState(checked, 0, sort.name, nameSearch)
        }
    }
    const handleCheckCategory = (event) => {
        setCheckFilter(true)
        setIsLoading(true)
        setNameSearch("")
        let updatedList = [...checked];
        if (event.target.checked) {
            checkedCategory.push(event.target.value)
            updatedList = [...checkedCategory]
        } else {
            {
                checkedCategory.splice(checkedCategory.indexOf(event.target.value), 1);
                updatedList = [...checkedCategory]
            }
        }
        console.log( checkedCategory);
        setState({
            current: 0,
        });
        setNameSearch("")
        setCheckNameSearch(false)
        getListAssetToPage(0,"")
    };


    return (
        <>
            <div>
                <div className="title">
                    <h2 style={{color: "red", textAlign: "inherit", fontWeight: "700"}}>Asset List</h2>
                </div>
                <div className="user-list-toolbar-wrapper">
                    <div className="user-list-toolbar">
                        <div className="filter_component filter-section-asset" style={{marginLeft: "25px"}}>
                            <div id="role-filter-section">
                                <div className="dropdown-toggle">
                                    <div className="dropdown-header">
                                        <div className="dropdown-title"
                                             style={{textAlign: "left", marginLeft: "10px"}}>State
                                        </div>
                                        <div className="dropdown-icon" style={{paddingTop: "0.3rem"}}>
                                            <FontAwesomeIcon icon={faFilter}/>
                                        </div>
                                    </div>
                                    <div className="dropdown-content-asset">
                                        <ul style={{listStyleType: "none"}}>
                                            {listState.map((item, index) => (
                                                <li key={index}>
                                                    <input value={item} type="checkbox"
                                                           name="role1" id={index}
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

                        <div className="filter_component filter-section-category" style={{marginRight: "80px"}}>
                            <div id="role-filter-section">
                                <div className="dropdown-toggle">
                                    <div className="dropdown-header">
                                        <div className="dropdown-title"
                                             style={{textAlign: "left", marginLeft: "10px"}}>Category
                                        </div>
                                        <div className="dropdown-icon" style={{paddingTop: "0.3rem"}}>
                                            <FontAwesomeIcon icon={faFilter}/>
                                        </div>
                                    </div>
                                    <div className="dropdown-content-category">
                                        <ul style={{listStyleType: "none"}}>
                                            <div id="Category">
                                                <div className="ex3">
                                                    <li key={6}>
                                                        <input value="All" type="checkbox" name="role" id={6}
                                                               style={{marginTop: "12px"}}
                                                               onChange={handleCheckCategory}
                                                        />
                                                        <label htmlFor={6}
                                                               style={{
                                                                   paddingLeft: "10px",
                                                                   display: "flex"
                                                               }}> All</label>
                                                    </li>
                                                    {listCategory.map((item, i) => (
                                                        <li key={i+7}>
                                                            <input value={item.categoryName} type="checkbox" name="role" id={i+7}
                                                                   style={{marginTop: "12px"}}
                                                                   onChange={handleCheckCategory}
                                                            />
                                                            <label htmlFor={i+7}
                                                                   style={{
                                                                       paddingLeft: "10px",
                                                                       display: "flex"
                                                                   }}> {item.categoryName}</label>
                                                        </li>
                                                    ))}
                                                </div>
                                            </div>

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
                                                findListAsset()
                                            }
                                            return false;
                                        }}
                                        onChange={e => (setNameSearch(e.target.value), setCheckNameSearch(false))}
                                    />

                                    <button type="button" className="button-search"

                                            onClick={findListAsset}>
                                        <FontAwesomeIcon icon={faSearch}/></button>
                                </div>
                            }
                            <div id="create-btn-section">
                                <button className="btn-createUser" onClick={() => {
                                    navigate("/asset/createAsset")}}>
                                    <p className="btn_create_text"> Create new asset</p>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div style={{ height : "100vh"}}>
                        {
                            !isLoading ?
                                <>
                                    <div className="results-section">
                                        <div className="Asset_table">
                                            <>
                                                <table>
                                                    {
                                                        totalPage === 0 ?
                                                            ""
                                                            :
                                                            <thead>
                                                            <tr>
                                                                <th  className="col_asset col_assetCode_asset">
                                                                    <p className="col_1 assetCode_asset_col">Asset Code
                                                                        {
                                                                            sort.name === "ca" ?
                                                                                <FontAwesomeIcon
                                                                                    id="up_No"
                                                                                    onClick={() => getListAssetSort("cd")}
                                                                                    style={{marginLeft: "0.3rem"}}
                                                                                    icon={faSortUp}>`
                                                                                </FontAwesomeIcon>
                                                                                :
                                                                                <FontAwesomeIcon
                                                                                    id="down_No"
                                                                                    onClick={() => getListAssetSort("ca")}
                                                                                    style={{marginLeft: "0.3rem"}}
                                                                                    icon={faSortDown}>`
                                                                                </FontAwesomeIcon>

                                                                        }
                                                                    </p>
                                                                </th>
                                                                <th className="col_asset col_assetName">
                                                                    <p className=" col_1 assetName_col">Asset Name
                                                                        {
                                                                            sort.name === "na" ?
                                                                                <FontAwesomeIcon
                                                                                    id="up_No"
                                                                                    onClick={() => getListAssetSort("nd")}
                                                                                    style={{marginLeft: "0.3rem"}}
                                                                                    icon={faSortUp}>`
                                                                                </FontAwesomeIcon>
                                                                                :
                                                                                <FontAwesomeIcon
                                                                                    id="down_No"
                                                                                    onClick={() => getListAssetSort("na")}
                                                                                    style={{marginLeft: "0.3rem"}}
                                                                                    icon={faSortDown}>`
                                                                                </FontAwesomeIcon>

                                                                        }
                                                                    </p>
                                                                </th>
                                                                <th className="col_asset col_assetCategory">
                                                                    <p className="col_1 assetCategory_col">Category
                                                                        {
                                                                            sort.name === "ea" ?
                                                                                <FontAwesomeIcon
                                                                                    id="up_No"
                                                                                    onClick={() => getListAssetSort("ed")}
                                                                                    style={{marginLeft: "0.3rem"}}
                                                                                    icon={faSortUp}>`
                                                                                </FontAwesomeIcon>
                                                                                :
                                                                                <FontAwesomeIcon
                                                                                    id="down_No"
                                                                                    onClick={() => getListAssetSort("ea")}
                                                                                    style={{marginLeft: "0.3rem"}}
                                                                                    icon={faSortDown}>`
                                                                                </FontAwesomeIcon>

                                                                        }
                                                                    </p>
                                                                </th>
                                                                <th className="col_asset col_state">
                                                                    <p className="col_1 state_col">State
                                                                        {
                                                                            sort.name === "sa" ?
                                                                                <FontAwesomeIcon
                                                                                    id="up_No"
                                                                                    onClick={() => getListAssetSort("sd")}
                                                                                    style={{marginLeft: "0.3rem"}}
                                                                                    icon={faSortUp}>`
                                                                                </FontAwesomeIcon>
                                                                                :
                                                                                <FontAwesomeIcon
                                                                                    id="down_No"
                                                                                    onClick={() => getListAssetSort("sa")}
                                                                                    style={{marginLeft: "0.3rem"}}
                                                                                    icon={faSortDown}>`
                                                                                </FontAwesomeIcon>

                                                                        }
                                                                    </p>
                                                                </th>
                                                            </tr>
                                                            </thead>
                                                    }
                                                    <TableAssets listAsset = {listAsset} listFilterState = {listAssetFilter}
                                                                 checkSearch ={checkFilter} isLoading ={isLoading}
                                                    />
                                                </table>
                                            </>
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

                                </>


                                :
                                <LoadingOutlined
                                    style={{fontSize: "60px", color: "red", textAlign: "center", marginTop: "70px"}}/>


                        }


                    </div>
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