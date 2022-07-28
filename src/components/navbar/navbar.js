import React, {Fragment, useEffect, useState, useRef} from 'react';
import {useNavigate} from "react-router-dom";
import {isMobile} from "react-device-detect";

import TopNavBar from "./topNavBar";
import SideNavBar from "./sideNavBar";
import TokenManager from "../../utils/authToken";


const NavBar = ({}) => {
    const tokenManager = new TokenManager();
    const navigate = useNavigate();
    const toggleMenuClass = 'toggle-sidebar';
    const [className, setClassName ] = useState('');

    const handleToggleMenuClick = () => {
        (className === toggleMenuClass)? setClassName('') : setClassName(toggleMenuClass);
    };

    const handleLogOut = async (event) => {
        event.preventDefault();
        await tokenManager.logOut();
        navigate('/login', { replace: true});
    };

    const handleGoToMyAccount = (event) => {
        event.preventDefault();
        navigate(
            '/my-account',
            {
                state: {
                    mainLiActiveKey: "M2",
                    associationMenuShowClass: ""
                }
            }
        );
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

    return (tokenManager.isAuthenticated() &&
        <Fragment>
            <div className={className}  ref={wrapperRef}>
                <TopNavBar handleToggleMenu={handleToggleMenuClick}
                           handleLogOut={handleLogOut}
                           handleGoToMyAccount={handleGoToMyAccount}
                />
                <SideNavBar handleLogOut={handleLogOut}
                            setClassName={setClassName}
                />
            </div>
        </Fragment>
    );
}

export default NavBar;
