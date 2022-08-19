import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom'

export default function Menucomponent({routes}){

    const location = window.location.href;
    const mark = location.split("/");
    return <Menu mode="inline" theme="light" 
    defaultSelectedKeys={"/" + mark[3]}
    > 
        {routes.map(function(route){
           return   <Menu.Item  key={route.path}>
             {route.title}
               <Link to={route.path} />
           </Menu.Item>
        })}
        
    </Menu>
}