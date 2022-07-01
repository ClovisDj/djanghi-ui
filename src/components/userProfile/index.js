import {Fragment} from "react";

import "./index.css"
import BaseUserProfile from "./base";
import BaseDashboard from "../dashboard/base";

const UserProfile = () => {
    return (
        <Fragment>
            <BaseDashboard
                ComponentToRender={BaseUserProfile}
            />
        </Fragment>
    );
};

export default UserProfile;

