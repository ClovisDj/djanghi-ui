import {Fragment, useEffect} from "react";

import NavBar from "../navbar/navbar";
import {useNavigate} from "react-router-dom";
import TokenManager from "../../utils/authToken";


const BaseDashboard = ({ ComponentToRender }) => {
    const tokenManager = new TokenManager();
    const navigate = useNavigate();

    useEffect(async () => {
        if (!tokenManager.isAuthenticated()) {
            tokenManager.logOut();
            navigate('/login', { replace: true});
        }
    }, []);

    return (
        <Fragment>
            <NavBar />
            <main id="main" className="main">
                <section className="section">
                    { <ComponentToRender /> }
                </section>
            </main>
        </Fragment>
    );
};

export default BaseDashboard;
