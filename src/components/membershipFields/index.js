import {Fragment} from "react";

import BaseDashboard from "../dashboard/base";

import BaseMembershipFields from "./base";
import "./index.css"

const MembershipFields = () => {
    return (
        <Fragment>
            <BaseDashboard
                ComponentToRender={BaseMembershipFields}
            />
        </Fragment>
    );
};

export default MembershipFields;

