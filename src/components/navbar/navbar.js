import React, {Fragment, useState,} from 'react';

import TopNavBar from "./topNavBar";
import SideNavBar from "./sideNavBar";
import TokenManager from "../../utils/authToken";
import {useNavigate} from "react-router-dom";


const NavBar = () => {
    const tokenManager = new TokenManager();
    let navigate = useNavigate();
    const toggleMenuClass = 'toggle-sidebar';
    const [className, setClassName ] = useState('');

    const handleToggleMenuClick = (e) => {
        (className === toggleMenuClass)? setClassName('') : setClassName(toggleMenuClass);
        e.preventDefault();
    };

    const handleLogOut = (event) => {
        event.preventDefault();
        tokenManager.logOut();
        navigate('/login', { replace: true});
    };

    return (
        <Fragment>
            <div className={className}>
                <TopNavBar
                    handleToggleMenu={handleToggleMenuClick}
                    handleLogOut={handleLogOut}
                />
                <SideNavBar/>
            </div>
        </Fragment>
    );
}

export default NavBar;
