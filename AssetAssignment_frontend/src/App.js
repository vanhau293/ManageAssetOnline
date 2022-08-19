import React, { createContext, useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import MenuComponent from "./components/MenuComponent";
import { AppRoutes } from "./routes/AppRoutes";
import { NavRoutes } from "./routes/NavRoutes";
import RouteComponent from "./components/RouteComponent";
import HeaderComponent from "./components/HeaderComponent";
import GridComponent from "./components/GridComponet";

import "antd/dist/antd.css";
import { UserRoute } from "./routes/UserRoute";
import Login from "./components/login/Login"; 
export const Context = createContext();

function App() {
  const [loginState, setLoginState] = useState({
    token: localStorage.token,
    isLogin: false,
    role: "",
    username: "",
    isfirstlogin: false,
    id: 1,
  });

  // axios.defaults.baseURL = `${process.env.REACT_APP_UNSPLASH_BASEURL}`;
  // axios.defaults.headers.common["Authorization"] = loginState.token;
  // axios.defaults.headers.post["Content-Type"] = "application/json";

  // axios.interceptors.request.use(
  //   (request) => {

  //     // Edit request config
  //     return request;
  //   },
  //   (error) => {

  //     return Promise.reject(error);
  //   }
  // );

  // axios.interceptors.response.use(
  //   (response) => {

  //     // Edit response config
  //     return response;
  //   },
  //   (error) => {

  //     return Promise.reject(error);
  //   }
  // );

  useEffect(() => {
    if (localStorage.getItem("loginState") !== null) {
      setLoginState(JSON.parse(localStorage.getItem("loginState")));
    }
  }, [loginState.token]);
  return (
  
    <div className="App">
      <Context.Provider value={[loginState, setLoginState]}>
        <BrowserRouter>
          {loginState.isLogin === false ? (
            <Login />
          ) : loginState.role === "admin" ? (
            <div id="container">
              <HeaderComponent username={loginState.username} isLogin={loginState.isfirstlogin} idAccount={loginState.id} token={loginState.token}/>
              <GridComponent
                leftComp={
                  <div>
                    {/* <ChangePasswordModal
                      isOpen={loginState.isfirstlogin}
                      userid={loginState.id}
                    /> */}
                    <MenuComponent routes={NavRoutes} />
                  </div>
                }
                rightComp={<RouteComponent routes={AppRoutes} />}
              />
            </div>
          ) : (
            <>
              <HeaderComponent username={loginState.username} isLogin={loginState.isfirstlogin} idAccount={loginState.id} token={loginState.token}/>
             
              <GridComponent
              leftComp={
                (
                  <>
                  {/* <ChangePasswordModal
                  isOpen={loginState.isfirstlogin}
                  userid={loginState.id}
                /> */}
                 <MenuComponent routes={UserRoute} />
                 
                </>
                
                )
               
              }

              rightComp={<RouteComponent routes={UserRoute} />}
              
              />

             
            </>
          )}
        </BrowserRouter>
      </Context.Provider>
    </div>
  );
}



export default App;
