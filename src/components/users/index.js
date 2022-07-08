import {Fragment} from "react";

import BaseDashboard from "../dashboard/base";

import "./index.css"
import BaseUsers from "./base";
import CustomToaster from "../sharedComponents/toaster/toastify";


const Users = () => {
    return (
        <Fragment>
            <BaseDashboard
                ComponentToRender={BaseUsers}
            />
            <CustomToaster />
        </Fragment>
    );
};

export default Users;
