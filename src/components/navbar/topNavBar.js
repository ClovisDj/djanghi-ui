import React, {Fragment} from 'react';
import {isMobile} from "react-device-detect";


const TopNavBar = ({handleToggleMenu, handleLogOut, user, association}) => {
    const lastName = user ? user.attributes.last_name.split(" ")[0] : "";
    const firstName = user ? user.attributes.first_name.split(" ")[0] : "";

    return (
            <Fragment>
            <header id="header" className="header fixed-top d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-between">
                    <a className="logo d-flex align-items-center">
                        <img src={process.env.PUBLIC_URL + "/favicon.ico"} alt=""/>
                        {association &&
                            <span className="d-none d-lg-block">{association.attributes.label}</span>
                        }
                    </a>
                    {isMobile &&
                        <i className="bi bi-list toggle-sidebar-btn" onClick={handleToggleMenu} />
                    }

                </div>

                <nav className="header-nav ms-auto">
                    <ul className="d-flex align-items-center">

                        <li className="nav-item dropdown pe-3">
                            <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#"
                               data-bs-toggle="dropdown">
                                <img src="https://img.icons8.com/pastel-glyph/64/000000/person-male--v1.png"/>
                                {user &&
                                    <span className="d-none d-md-block dropdown-toggle ps-2">
                                        {firstName} {lastName}
                                    </span>
                                }
                            </a>

                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                                <li className="dropdown-header">
                                    { user &&
                                        <h6>
                                            {firstName} {lastName}
                                        </h6>
                                    }
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <a className="dropdown-item d-flex align-items-center">
                                        <i className="bi bi-person" />
                                        <span>My Profile</span>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                <li>
                                    <a className="dropdown-item d-flex align-items-center">
                                        <i className="bi bi-gear" />
                                        <span>Account Settings</span>
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
