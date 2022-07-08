import React, {Fragment, useContext, useEffect, useState} from 'react';
import {isMobile} from "react-device-detect";
import {toTitle} from "../../utils/utils";

import logo from '../../../public/favicon.ico';
import {UserDataContext} from "../../app/contexts";


const TopNavBar = ({handleToggleMenu, handleLogOut, handleGoToMyAccount}) => {
    const [user, setUser] = useState();
    const [association, setAssociation] = useState();
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const userDataContext = useContext(UserDataContext);

    useEffect(() => {
        if (userDataContext.user) {
            setUser(userDataContext.user);
            setAssociation(userDataContext.user.included[0]);
            setLastName(userDataContext.user.data.attributes.last_name.split(" ")[0]);
            setFirstName(userDataContext.user.data.attributes.first_name.split(" ")[0]);
        }
    }, [userDataContext.user]);

    return (
            <Fragment>
            <header id="header" className="header fixed-top d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-between">
                    {isMobile &&
                        <i className="bi bi-list toggle-sidebar-btn" onClick={handleToggleMenu} />
                    }
                    <a className="logo d-flex align-items-center" id='toggle-menu'>
                        <img src={logo} alt=""/>
                        {association &&
                            <span>{toTitle(association.attributes.label)}</span>
                        }
                    </a>

                </div>

                <nav className="header-nav ms-auto">
                    <ul className="d-flex align-items-center">

                        <li className="nav-item dropdown pe-3">
                            <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#"
                               data-bs-toggle="dropdown">
                                <img src="https://img.icons8.com/pastel-glyph/64/000000/person-male--v1.png"/>
                                {user &&
                                    <span className="d-none d-md-block ps-2">
                                        {toTitle(firstName)} {toTitle(lastName)}
                                    </span>
                                }
                            </a>

                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                                <li className="dropdown-header">
                                    { user &&
                                        <h6>
                                            {toTitle(firstName)} {toTitle(lastName)}
                                        </h6>
                                    }
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <a className="dropdown-item d-flex align-items-center" onClick={handleGoToMyAccount} style={{cursor: "pointer"}}>
                                        <i className="bi bi-person" />
                                        <span>My Account</span>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <a className="dropdown-item d-flex align-items-center"
                                       onClick={handleLogOut} style={{cursor: "pointer"}}>
                                        <i className="bi bi-box-arrow-right" />
                                        <span>Sign Out</span>
                                    </a>
                                </li>
                            </ul>

                        </li>

                    </ul>
                </nav>

            </header>
        </Fragment>
    );
}

export default TopNavBar;
