import {Fragment} from "react";

import BaseDashboard from "../dashboard/base";

import "./index.css"
import BaseUsers from "./base";

const Users = () => {
    return (
        <Fragment>
            <BaseDashboard
                ComponentToRender={BaseUsers}
            />
        </Fragment>
    );
};

export default Users;
