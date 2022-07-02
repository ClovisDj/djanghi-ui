import {Fragment} from "react";

import "react-toastify/dist/ReactToastify.css";

import "./index.css"
import 'react-phone-number-input/style.css'
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

