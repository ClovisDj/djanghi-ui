import {Fragment, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

import PaymentChart from "./donutChart";
import PaymentSummary from "./paymentSummary";

import ApiClient from "../../utils/apiConfiguration";
import TokenManager from "../../utils/authToken";
import DataParser from "../../utils/dataParser";
import {arrayDifference, getIdsFromArray, getObjectById, toTitle} from "../../utils/utils";

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

    const buildDummyPaymentStatus = (includedItem) => {
        return {
            type: "MembershipPaymentSatus",
            id: uuidv4(),
            attributes: {
                current_value: 0,
                paid_percentage: 0,
            },
            relationships: {
                membership_payment_type: includedItem,
            },
        };
    };

    useEffect(async () => {
        let paymentData = await apiClient.get(`users/${tokenManager.getUserId()}/payments_status`);
        const contribData = await apiClient.get("contribution_fields");
        if (paymentData) {
            const dataParser = new DataParser(paymentData);
            paymentData = dataParser.data;
            const contribIds = getIdsFromArray(contribData.data);
            const includedContribIds = getIdsFromArray(dataParser.data.included);
            const idsWithoutPaymentsStatus = arrayDifference(contribIds, includedContribIds);

            if (idsWithoutPaymentsStatus.length > 0) {
                let includedObject;
                for (let idItem of idsWithoutPaymentsStatus) {
                    includedObject = getObjectById(contribData.data, idItem);
                    paymentData.data.push(buildDummyPaymentStatus(includedObject));
                }
                // We sort payments statuses by contribution field name
                paymentData.data.sort((itemA, itemB) => {
                    const paymentNameA = itemA.relationships.membership_payment_type.attributes.name;
                    const paymentNameB = itemB.relationships.membership_payment_type.attributes.name;
                    return paymentNameA.localeCompare(paymentNameB) ;
                });
            }

            setPaymentsStatus(paymentData);
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
