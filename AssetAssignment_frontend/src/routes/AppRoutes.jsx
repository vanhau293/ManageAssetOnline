import CreateAsset from "../components/admin/assets/CreateAsset";
import EditAsset from "../components/admin/assets/EditAsset";
import ManageAsset from "../components/admin/assets/ManageAsset";
import CreateAssignment from "../components/admin/assignments/CreateAssignment";
import EditAssignment from "../components/admin/assignments/EditAssignment";
import ManageAssignment from "../components/admin/assignments/ManageAssignment";
import HomeAdmin from "../components/admin/HomeAdmin";
import CreateUser from "../components/admin/users/CreateUser";
import EditUser from "../components/admin/users/EditUser";
import ManageUser from "../components/admin/users/ManageUser";
import RequestForReturningPage from "../components/admin/request/RequestForReturning"



export const AppRoutes = [
    {
        path: "/",
        element: <HomeAdmin/>,
        title: "Home",
    },
    {
        path: "/user/createuser",
        element: <CreateUser/>,
        title: "Manage User > Create User",
    },
    {
        path: "/user",
        element: <ManageUser/>,
        title: "Manage User",
    },
    {
        path: "/asset",
        element: <ManageAsset/>,
        title: "Manage Asset",
    },
    {
        path: "/asset/editAsset/:id",
        element: <EditAsset/>,
        title: "Manage Asset > Edit Asset",
    },
    {
        path: "/assignment",
        element: <ManageAssignment/>,
        title: "Manage Assignment",
    },
    {
        path: "/assignment/createAssignment",
        element: <CreateAssignment/>,
        title: "Manage Assignment > Create Assignment",
    },
    {
        path: "/assignment/editAssignment/:id",
        element: <EditAssignment/>,
        title: "Manage Assignment > Edit Assignment",
    },
    {
        path: "/request",
        element: <RequestForReturningPage/>,
        title: "Request for Returning",
    },

    // {
    //     path: "/report",
    //     element: <ReportPage/>,
    //     title: "Report",
    // },


    {
        path: "/user/editUser/:id",
        element: <EditUser/>,
        title: "Manage User > Edit User",
    },
    {
        path: "/asset/createAsset",
        element: <CreateAsset/>,
        title: "Manage Asset > Create Asset",
    },
];
