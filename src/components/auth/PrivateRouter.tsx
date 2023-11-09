import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../../app/hooks";
import useFetchData from "../../hook/useFetchData";

function PrivateRoute() {
    useFetchData()
    const isAuthenticated = useAppSelector(store => store.auth.isAuthenticated);
    const id_token = localStorage.getItem("id_token")
    const location = useLocation();

    if (isAuthenticated && id_token) {
        return <Outlet />
    } else {
        return (<Navigate to="/sign_in" state={location} />);
    }
}

export default PrivateRoute;