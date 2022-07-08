import {Fragment, useContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {UserDataContext} from "../../app/contexts";


const SideNavBar = ({handleLogOut}) => {
    let navigate = useNavigate();
    const userDataContext = useContext(UserDataContext);
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [userIsFullAdmin, setUserIsFullAdmin] = useState(false);
    const [userIsPaymentAdmin, setUserIsPaymentAdmin] = useState(false);
    const [mainLiActiveKey, setMainLiActiveKey] = useState("M1");
    const [associationMenuShowClass, setAssociationMenuShowClass] = useState("");
    const sideActiveClass = "side-active";

    const actionsMap = {
        M1: () => {navigate('/dashboard')},
        M2: () => {
            navigate(
                '/my-account',
                {
                    state: {
                        mainLiActiveKey: "M2",
                        associationMenuShowClass: ""
                    }
                }
            )
        },
        M3: () => {},
        M4: () => {
            navigate('/membership-fields',
                {
                    state: {
                        mainLiActiveKey: "M4",
                        associationMenuShowClass: associationMenuShowClass
                    }
                }
            )
        },
        M5: () => {
            navigate('/membership-payments',
                {
                    state: {
                        mainLiActiveKey: "M5",
                        associationMenuShowClass: associationMenuShowClass
                    }
                }
                )
        },
        M6: () => {
            navigate('/users',
                {
                    state: {
                        mainLiActiveKey: "M6",
                        associationMenuShowClass: associationMenuShowClass
                    }
                }
                )
        },
    };
    const handleSideNavClick = async (liKey) => {
        await setMainLiActiveKey(liKey);
        await actionsMap[liKey]();

        if (liKey === "M3") {
            setAssociationMenuShowClass(associationMenuShowClass ? "" : "show");
        }
    }

    const location = useLocation();

    useEffect(async () => {
        if (location.state) {
            setMainLiActiveKey(location.state.mainLiActiveKey);
            setAssociationMenuShowClass(location.state.associationMenuShowClass);
        }
    }, [location]);

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
            <a className={"nav-link collapsed " + (mainLiActiveKey === "M3" ? sideActiveClass : "")}
               data-bs-target="#components-nav" data-bs-toggle="collapse" onClick={() => handleSideNavClick("M3")}>
                <i className={"bi bi-menu-button-wide" + (mainLiActiveKey === "M3" ? "-fill" : "")} />
                <span>Association Menu</span>
                <i className="bi bi-chevron-down ms-auto" />
            </a>

                <ul id="components-nav" className={"nav-content collapse " + associationMenuShowClass} data-bs-parent="#sidebar-nav">
                    {userIsFullAdmin &&
                        <li key="M4">
                            <a className={mainLiActiveKey === "M4"? sideActiveClass: ""}
                               onClick={() => handleSideNavClick("M4")}>
                                <i className={"bi bi-circle" + ( mainLiActiveKey === "M4" ? "-fill": "" )} />
                                <span className="text-capitalize">MemberShip Fields</span>
                            </a>
                        </li>
                    }
                    {(userIsFullAdmin || userIsPaymentAdmin) &&
                        <li key="M5">
                            <a className={mainLiActiveKey === "M5" ? sideActiveClass: ""}
                               onClick={() => handleSideNavClick("M5")}>
                                <i className={"bi bi-circle" + ( mainLiActiveKey === "M5" ? "-fill": "" )} />
                                <span className="text-capitalize">MemberShip Payments</span>
                            </a>
                        </li>
                    }
                    {userIsAdmin  &&
                        <li key="M6">
                            <a className={mainLiActiveKey === "M6" ? sideActiveClass: ""}
                               onClick={() => handleSideNavClick("M6")}>
                                <i className={"bi bi-circle" + ( mainLiActiveKey === "M6" ? "-fill": "" )} />
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
                        <a className={"nav-link " + ( mainLiActiveKey === "M1" ? sideActiveClass: "" )}
                           onClick={() => handleSideNavClick("M1")}>
                            <i className={"bi bi-grid" + (mainLiActiveKey === "M1"? "-fill": "")} />
                            <span>Dashboard</span>
                        </a>
                    </li>

                    <li className="nav-item" style={{cursor: "pointer"}} key="M2">
                        <a className={"nav-link collapsed " + ( mainLiActiveKey === "M2" ? sideActiveClass: "" )}
                           onClick={() => handleSideNavClick("M2")}>
                            <i className={"bi bi-person" + ( mainLiActiveKey === "M2" ? "-fill": "" )} />
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
