import {Fragment} from "react";

import BaseDashboard from "../dashboard/base";

import BaseOptInPayments from "./base";

const MembershipPaymentsOptIn = () => {
    return (
        <Fragment>
            <BaseDashboard ComponentToRender={BaseOptInPayments} />
        </Fragment>
    );
};

export default MembershipPaymentsOptIn;
