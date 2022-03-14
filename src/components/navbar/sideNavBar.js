import {Fragment, useState} from "react";


const SideNavBar = ({user, association}) => {
    const userIsAdmin = (user && user.attributes.hasOwnProperty("is_admin")) ? user.attributes.is_admin : false;
    let [mainLiActiveKey, setMainLiActiveKey] = useState("M1");
    const sideActiveClass = "side-active";

    const handleSideNavClick = (liKey) => {
      setMainLiActiveKey(liKey);
    }


    const associationMenu = (userIsAdmin &&
        <li className="nav-item" style={{cursor: "pointer"}} key="M3">
            <a className={"nav-link collapsed " + (mainLiActiveKey === "M3"? sideActiveClass: "")}
               data-bs-target="#components-nav" data-bs-toggle="collapse" onClick={() => handleSideNavClick("M3")}>
                <i className="bi bi-menu-button-wide"></i><span>Association Menu</span><i
                className="bi bi-chevron-down ms-auto"></i>
            </a>

            <ul id="components-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                <li>
                    <a><i className="bi bi-circle"></i><span className="text-capitalize">MemberShip Payments</span></a>
                </li>
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
