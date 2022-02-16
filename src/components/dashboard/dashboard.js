import {Fragment, useEffect} from "react";

import NavBar from "../navbar/navbar";
import {useLocation, useNavigate} from "react-router-dom";
import TokenManager from "../../utils/authToken";


const Dashboard = () => {
    const tokenManager = new TokenManager();
    let navigate = useNavigate();
    let location = useLocation();

    useEffect(() => {
        if (!tokenManager.isAuthenticated()) {
            navigate('/login', { replace: true});
        }
    }, [location]);

    return (
        <Fragment>
            <NavBar />
        </Fragment>
    );
};

export default Dashboard;