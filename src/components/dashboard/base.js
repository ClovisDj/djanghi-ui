import {Fragment, useEffect, useState} from "react";

import NavBar from "../navbar/navbar";
import {useLocation, useNavigate} from "react-router-dom";
import TokenManager from "../../utils/authToken";
import ApiClient from "../../utils/apiConfiguration";


const BaseDashboard = ({ ComponentToRender }) => {
    const apiClient = new ApiClient();
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
            } else {
                navigate('/login', { replace: true});
            }
        }
    }, [location]);

    return (
        <Fragment>
            <NavBar
                user={user}
                association={association}
            />
            <main id="main" className="main">
                <section className="section">
                    { <ComponentToRender /> }
                </section>
            </main>
        </Fragment>
    );
};

export default BaseDashboard;
