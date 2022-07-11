import {Fragment, useState, useEffect} from "react";

import NavBar from "../navbar/navbar";
import {useNavigate} from "react-router-dom";
import TokenManager from "../../utils/authToken";

import {UserDataContext} from "../../app/contexts";


const BaseDashboard = ({ ComponentToRender }) => {
    const tokenManager = new TokenManager();
    const navigate = useNavigate();
    const [user, setUser] = useState();

    useEffect(async () => {
        if (!tokenManager.isAuthenticated()) {
            await tokenManager.logOut();
            navigate('/login', { replace: true});
        } else {
            setUser(tokenManager.getAuthUser());
        }
    }, []);

    return (
        <UserDataContext.Provider value={{ user: user, setUser: setUser}}>
            <Fragment>
                <NavBar />
                <main id="main" className="main">
                    <section className="section">
                        { <ComponentToRender /> }
                    </section>
                </main>
            </Fragment>
        </UserDataContext.Provider>
    );
};

export default BaseDashboard;
