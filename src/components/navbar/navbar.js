import React, {Fragment, useState,} from 'react';

import TopNavBar from "./topNavBar";
import SideNavBar from "./sideNavBar";
import TokenManager from "../../utils/authToken";
import {useNavigate} from "react-router-dom";


const NavBar = ({user, association}) => {
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
                    user={user}
                    association={association}
                />
                <SideNavBar
                    user={user}
                    association={association}
                />
            </div>
        </Fragment>
    );
}

export default NavBar;
