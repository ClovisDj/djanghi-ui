import {Fragment} from "react";


const SideNavBar = ({user, association}) => {
    const userIsAdmin = (user && user.attributes.hasOwnProperty("is_admin")) ? user.attributes.is_admin : false;
    const associationFields = association ? association.attributes.member_contribution_fields : [];

    const associationFieldLiElements = (
        associationFields.map((field, index) => (
            <li key={index}>
                <a><i className="bi bi-circle"></i><span>{field.name}</span></a>
            </li>
            )
        )
    );

    const associationMenu = (userIsAdmin &&
        <li className="nav-item" style={{cursor: "pointer"}}>
            <a className="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse">
                <i className="bi bi-menu-button-wide"></i><span>Association Menu</span><i
                className="bi bi-chevron-down ms-auto"></i>
            </a>

            <ul id="components-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                {associationFieldLiElements}
            </ul>
        </li>
    );

    return (
        <Fragment>
            <aside id="sidebar" className="sidebar">

                <ul className="sidebar-nav" id="sidebar-nav">

                    <li className="nav-item">
                        <a className="nav-link " href="index.html">
                            <i className="bi bi-grid"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>

                    {associationMenu}

                    <li className="nav-heading">Pages</li>

                    <li className="nav-item" style={{cursor: "pointer"}}>
                        <a className="nav-link collapsed">
                            <i className="bi bi-person"></i>
                            <span>Profile</span>
                        </a>
                    </li>

                </ul>

            </aside>
        </Fragment>
    );
}

export default SideNavBar;
