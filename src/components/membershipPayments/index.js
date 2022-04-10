import {Fragment} from "react";

import BaseDashboard from "../dashboard/base";

import "./index.css"
import BaseMembershipPayments from "./base";

const MembershipPayments = () => {
    return (
        <Fragment>
            <BaseDashboard
                ComponentToRender={BaseMembershipPayments}
            />
        </Fragment>
    );
};

export default MembershipPayments;

