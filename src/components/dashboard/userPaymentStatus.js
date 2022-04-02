import {Fragment, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

import PaymentChart from "./donutChart";
import PaymentSummary from "./paymentSummary";

import ApiClient from "../../utils/apiConfiguration";
import TokenManager from "../../utils/authToken";
import DataParser from "../../utils/dataParser";
import {toTitle} from "../../utils/utils";

const apiClient = new ApiClient();
const tokenManager = new TokenManager();


const PaymentTitleHeader = ({paymentName}) => {
    return (
        <Fragment>
            <div className="row payment-title-row">
                <div className="col">
                    <div className="title-card align-bottom">
                        <h5 className="card-title card-title-text text-center align-bottom">{toTitle(paymentName)}</h5>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

const SinglePaymentStatus = ({paymentData}) => {
    const paymentName = paymentData.relationships.membership_payment_type.attributes.name;
    const requiredAmount = paymentData.relationships.membership_payment_type.attributes.required_amount;
    const contributionId = paymentData.relationships.membership_payment_type.id;
    const currentValue = paymentData.attributes.current_value;

    return (
        <Fragment>
            <PaymentTitleHeader paymentName={paymentName}/>
            <div className="row">
                <PaymentChart paymentData={paymentData}/>
                <PaymentSummary
                    contributionId={contributionId}
                    currentValue={currentValue}
                    requiredAmount={requiredAmount}
                    paymentName={paymentName}
                />
            </div>
        </Fragment>
    );
};


const UserPaymentStatus = () => {
    const [paymentsStatus, setPaymentsStatus] = useState({data: []});
    const location = useLocation();

    useEffect(async () => {
        const paymentData = await apiClient.get(`users/${tokenManager.getUserId()}/payments_status`);
        if (paymentData) {
            const dataParser = new DataParser(paymentData);
            setPaymentsStatus(dataParser.data);
        }
    }, [location]);

    const listPayments = paymentsStatus.data.map((paymentStatus) => {
        return <SinglePaymentStatus key={paymentStatus.id} paymentData={paymentStatus} />;
    });

    return (
        <Fragment>
            {listPayments}
        </Fragment>

    );
};

export default UserPaymentStatus;
