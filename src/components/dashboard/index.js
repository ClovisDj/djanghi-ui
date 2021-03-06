import {Fragment} from "react";
import BaseDashboard from "./base";
import UserPaymentStatus from "./userPaymentStatus";

import "./index.css"
import '../../../public/favicon.ico';

const Dashboard = () => {

    return (
        <Fragment>
            <BaseDashboard ComponentToRender={UserPaymentStatus} />
        </Fragment>
    );
};

export default Dashboard;
