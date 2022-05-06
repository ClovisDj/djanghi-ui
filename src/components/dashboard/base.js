import {Fragment, useEffect, useState} from "react";

import NavBar from "../navbar/navbar";
import {useNavigate} from "react-router-dom";
import TokenManager from "../../utils/authToken";


const BaseDashboard = ({ ComponentToRender }) => {
    const [user, setUser] = useState(null);
    const [association, setAssociation] = useState(null);
    const tokenManager = new TokenManager();
    let navigate = useNavigate();

    useEffect(async () => {
        if (!tokenManager.isAuthenticated()) {
            tokenManager.logOut();
            navigate('/login', { replace: true});
        } else {
            const authUser = tokenManager.getAuthUser();
            if (authUser) {
                await setUser(authUser.data);
                await setAssociation(authUser.included[0]);
            } else {
                navigate('/login', { replace: true});
            }
        }
    }, []);

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
