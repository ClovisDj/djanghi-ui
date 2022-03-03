import {Fragment, useEffect, useState} from "react";

import NavBar from "../navbar/navbar";
import {useLocation, useNavigate} from "react-router-dom";
import TokenManager from "../../utils/authToken";
import ApiClient from "../../utils/apiConfiguration";


const apiClient = new ApiClient();

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [association, setAssociation] = useState(null);
    const tokenManager = new TokenManager();
    let navigate = useNavigate();
    let location = useLocation();

    useEffect(async () => {
        if (!tokenManager.isAuthenticated()) {
            navigate('/login', { replace: true});
        } else {
            const data = await apiClient.get(`users/${tokenManager.getUserId()}`);
            if (data) {
                await setUser(data.data);
                await setAssociation(data.included[0]);
            }
        }
    }, [location]);

    return (
        <Fragment>
            <NavBar
                user={user}
                association={association}
            />
        </Fragment>
    );
};

export default Dashboard;