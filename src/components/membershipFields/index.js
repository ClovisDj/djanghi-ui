import {Fragment} from "react";

import BaseDashboard from "../dashboard/base";

import "./index.css"
import {useLocation} from "react-router-dom";

const BaseMembershipFields = () => {
    return(
        <Fragment>

        </Fragment>
    );
};

const MembershipFields = () => {
    const { state } = useLocation();
    console.log("Inside Membership:", state);
    return (
        <Fragment>
            <BaseDashboard
                ComponentToRender={BaseMembershipFields}
                stateProps={state}
            />
        </Fragment>
    );
};

export default MembershipFields;

