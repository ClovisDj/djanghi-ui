import {Fragment, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {UserDataContext} from "../../app/contexts";
import {NavBarContext} from "./context";
import {isMobile} from "react-device-detect";
import TokenManager from "../../utils/authToken";


const tokenManager = new TokenManager();

const SideNavBar = ({handleLogOut, setClassName}) => {
    let navigate = useNavigate();
    const userDataContext = useContext(UserDataContext);
    const navBarContext = useContext(NavBarContext);
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [userIsFullAdmin, setUserIsFullAdmin] = useState(false);
    const [userIsPaymentAdmin, setUserIsPaymentAdmin] = useState(false);
    const sideActiveClass = "side-active";

    const actionsMap = {
        M1: () => navigate('/dashboard'),
        M2: () => navigate('/my-account'),
        M3: () => {},
        M4: () => navigate('/membership-fields'),
        M5: () => navigate('/membership-payments'),
        M6: () => navigate('/users'),
    };

    const handleSideNavClick = async (liKey) => {
        await navBarContext.setMainLiActiveKey(liKey);
        await actionsMap[liKey]();

        if (isMobile && liKey !== "M3") {
            setClassName("");
        }
    }

    useEffect(() => {
        const storedUser = tokenManager.getAuthUser();
        if (storedUser) {
            userDataContext.setUser(storedUser);
        }
    }, []);

    useEffect(() => {
        if (userDataContext.user) {
            const attributes = userDataContext.user.data.attributes;
            setUserIsAdmin(attributes.hasOwnProperty("is_admin") ? attributes.is_admin : false);
            setUserIsFullAdmin(
                attributes.hasOwnProperty("is_full_admin") ? attributes.is_full_admin : false
            );
            setUserIsPaymentAdmin(
                attributes.hasOwnProperty("is_payment_manager") ? attributes.is_payment_manager : false
            );
        }
    }, [userDataContext.user]);

    const associationMenu = (userIsAdmin &&
        <li className="nav-item" style={{cursor: "pointer"}} key="M3">
            <a className={"nav-link collapsed " + (navBarContext.mainLiActiveKey === "M3" ? sideActiveClass : "")}
               data-bs-target="#components-nav" data-bs-toggle="collapse" onClick={() => handleSideNavClick("M3")}>
                <i className={"bi bi-menu-button-wide" + (navBarContext.mainLiActiveKey === "M3" ? "-fill" : "")} />
                <span>Association Menu</span>
                <i className="bi bi-chevron-down ms-auto" />
            </a>

                <ul id="components-nav" className={"nav-content collapse " + navBarContext.associationMenuShowClass} data-bs-parent="#sidebar-nav">
                    {userIsFullAdmin &&
                        <li key="M4">
                            <a className={navBarContext.mainLiActiveKey === "M4"? sideActiveClass: ""}
                               onClick={() => handleSideNavClick("M4")}>
                                <i className={"bi bi-circle" + ( navBarContext.mainLiActiveKey === "M4" ? "-fill": "" )} />
                                <span className="text-capitalize">MemberShip Fields</span>
                            </a>
                        </li>
                    }
                    {(userIsFullAdmin || userIsPaymentAdmin) &&
                        <li key="M5">
                            <a className={navBarContext.mainLiActiveKey === "M5" ? sideActiveClass: ""}
                               onClick={() => handleSideNavClick("M5")}>
                                <i className={"bi bi-circle" + ( navBarContext.mainLiActiveKey === "M5" ? "-fill": "" )} />
                                <span className="text-capitalize">MemberShip Payments</span>
                            </a>
                        </li>
                    }
                    {userIsAdmin  &&
                        <li key="M6">
                            <a className={navBarContext.mainLiActiveKey === "M6" ? sideActiveClass: ""}
                               onClick={() => handleSideNavClick("M6")}>
                                <i className={"bi bi-circle" + ( navBarContext.mainLiActiveKey === "M6" ? "-fill": "" )} />
                                <span className="text-capitalize">Users</span>
                            </a>
                        </li>
                    }
                </ul>

        </li>
    );

    return (
        <Fragment>
            <aside id="sidebar" className="sidebar">
                <ul className="sidebar-nav" id="sidebar-nav">
                    <li className="nav-item" style={{cursor: "pointer"}} key="M1">
                        <a className={"nav-link " + ( navBarContext.mainLiActiveKey === "M1" ? sideActiveClass: "" )}
                           onClick={() => handleSideNavClick("M1")}>
                            <i className={"bi bi-grid" + (navBarContext.mainLiActiveKey === "M1"? "-fill": "")} />
                            <span>Dashboard</span>
                        </a>
                    </li>

                    <li className="nav-item" style={{cursor: "pointer"}} key="M2">
                        <a className={"nav-link collapsed " + ( navBarContext.mainLiActiveKey === "M2" ? sideActiveClass: "" )}
                           onClick={() => handleSideNavClick("M2")}>
                            <i className={"bi bi-person" + ( navBarContext.mainLiActiveKey === "M2" ? "-fill": "" )} />
                            <span>My Account</span>
                        </a>
                    </li>

                    {associationMenu}

                    <li>
                        <hr className="side-navbar-divider" />
                    </li>

                    <li className="nav-item">
                        <a className="nav-link align-items-center"
                           onClick={handleLogOut} style={{cursor: "pointer"}}>
                            <i className="bi bi-box-arrow-right" />
                            <span> Sign Out</span>
                        </a>
                    </li>

                </ul>
            </aside>
        </Fragment>
    );
}

export default SideNavBar;
