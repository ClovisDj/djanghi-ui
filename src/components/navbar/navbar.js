import React, {Fragment, useEffect, useState, useRef} from 'react';

import TopNavBar from "./topNavBar";
import SideNavBar from "./sideNavBar";
import TokenManager from "../../utils/authToken";
import {useNavigate} from "react-router-dom";
import {isMobile} from "react-device-detect";


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

    const useOutsideLeftNavBarClick = (ref) => {
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    // Clear `toggle-sidebar` class on click outside left navbar
                    setClassName('');
                }
            }
            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    };

    const wrapperRef = isMobile ? useRef(null) : () => {};
    useOutsideLeftNavBarClick(wrapperRef);

    return (
        <Fragment>
            <div className={className}  ref={wrapperRef}>
                <TopNavBar
                    handleToggleMenu={handleToggleMenuClick}
                    handleLogOut={handleLogOut}
                    user={user}
                    association={association}
                />
                <SideNavBar
                    user={user}
                />
            </div>
        </Fragment>
    );
}

export default NavBar;
