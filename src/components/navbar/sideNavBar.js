import {Fragment, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";


const SideNavBar = ({user}) => {
    let navigate = useNavigate();
    const userIsAdmin = (user && user.attributes.hasOwnProperty("is_admin")) ? user.attributes.is_admin : false;
    const userIsFullAdmin = (user && user.attributes.hasOwnProperty("is_full_admin")) ? user.attributes.is_full_admin : false;
    const userIsPaymentAdmin = (user && user.attributes.hasOwnProperty("is_payment_manager")) ? user.attributes.is_payment_manager : false;
    const [mainLiActiveKey, setMainLiActiveKey] = useState("M1");
    const [associationMenuShowClass, setAssociationMenuShowClass] = useState("");
    const sideActiveClass = "side-active";
    const actionsMap = {
        M1: () => {navigate('/dashboard')},
        M2: () => {navigate('/profile')},
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

    const associationMenu = (userIsAdmin &&
        <li className="nav-item" style={{cursor: "pointer"}} key="M3">
            <a className={"nav-link collapsed " + (mainLiActiveKey === "M3" ? sideActiveClass : "")}
               data-bs-target="#components-nav" data-bs-toggle="collapse" onClick={() => handleSideNavClick("M3")}>
                <i className="bi bi-menu-button-wide" /><span>Association Menu</span><i className="bi bi-chevron-down ms-auto" />
            </a>

                <ul id="components-nav" className={"nav-content collapse " + associationMenuShowClass} data-bs-parent="#sidebar-nav">
                    {userIsFullAdmin &&
                        <li key="M4">
                            <a className={mainLiActiveKey === "M4"? sideActiveClass: ""}
                               onClick={() => handleSideNavClick("M4")}>
                                <i className={"bi bi-circle"} />
                                <span className="text-capitalize">MemberShip Fields</span>
                            </a>
                        </li>
                    }
                    {(userIsFullAdmin || userIsPaymentAdmin) &&
                        <li key="M5">
                            <a className={mainLiActiveKey === "M5"? sideActiveClass: ""}
                               onClick={() => handleSideNavClick("M5")}>
                                <i className={"bi bi-circle"} />
                                <span className="text-capitalize">MemberShip Payments</span>
                            </a>
                        </li>
                    }
                    {userIsAdmin  &&
                        <li key="M6">
                            <a className={mainLiActiveKey === "M6"? sideActiveClass: ""}
                               onClick={() => handleSideNavClick("M6")}>
                                <i className={"bi bi-circle"} />
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
                        <a className={"nav-link " + (mainLiActiveKey === "M1"? sideActiveClass: "")}
                           onClick={() => handleSideNavClick("M1")}>
                            <i className="bi bi-grid"/>
                            <span>Dashboard</span>
                        </a>
                    </li>

                    <li className="nav-item" style={{cursor: "pointer"}} key="M2">
                        <a className={"nav-link collapsed " + (mainLiActiveKey === "M2"? sideActiveClass: "")}
                           onClick={() => handleSideNavClick("M2")}>
                            <i className="bi bi-person"/>
                            <span>Profile</span>
                        </a>
                    </li>

                    {associationMenu}

                </ul>
            </aside>
        </Fragment>
    );
}

export default SideNavBar;
