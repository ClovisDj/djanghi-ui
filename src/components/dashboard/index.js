import {Fragment} from "react";
import BaseDashboard from "./base";
import UserPaymentStatus from "./userPaymentStatus";


const Dashboard = () => {

    return (
        <Fragment>
            <BaseDashboard ComponentToRender={UserPaymentStatus}/>
        </Fragment>
    );
};

export default  Dashboard;

