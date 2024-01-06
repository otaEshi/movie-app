import { Navigate, Outlet, useLocation } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useFetchData from "../../hook/useFetchData";
import { userInfoRequest } from "./authApi";

function PrivateRoute() {
    useFetchData()
    const isAuthenticatedString = localStorage.getItem('isAuthenticated');
    const isAuthenticated = isAuthenticatedString ? JSON.parse(isAuthenticatedString) : false;
    const access_token = localStorage.getItem("access_token")
    const location = useLocation();
    // const dispatch = useAppDispatch();

    if (isAuthenticated && access_token) {
        return <Outlet />
    } else {
        return (<Navigate to="/" state={location} />);
    }
}

export default PrivateRoute;