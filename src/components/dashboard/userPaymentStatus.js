import {Fragment, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

import PaymentChart from "./donutChart";
import PaymentSummary from "./paymentSummary";

import ApiClient from "../../utils/apiConfiguration";
import TokenManager from "../../utils/authToken";
import DataParser from "../../utils/dataParser";
import {arrayDifference, buildDummyPaymentStatus, getIdsFromArray, getObjectById, toTitle} from "../../utils/utils";
import ReactTooltip from "react-tooltip";

const apiClient = new ApiClient();
const tokenManager = new TokenManager();


const PaymentTitleHeader = ({ paymentName, isRequired }) => {
    const dataTipMessage = "This field is required for your good membership standing!";

    useEffect(() => {
        ReactTooltip.rebuild();
    }, []);

    return (
        <Fragment>
            <div key={uuidv4()} className="row title-card align-items-center justify-content-center">
                <div className="col">
                    <h5 className="text-center">
                            {toTitle(paymentName)}
                            &nbsp;
                        {isRequired &&
                            <span data-tip={dataTipMessage} >
                                <ReactTooltip id={uuidv4()} html={true} className="custom-tooltip" />
                                <i key={uuidv4()} className="fas fa-info-circle" />
                            </span>
                        }
                    </h5>
                </div>
            </div>
        </Fragment>
    );
};

export const SinglePaymentStatus = ({paymentData}) => {
    const paymentName = paymentData.relationships.membership_payment_type.attributes.name;
    const requiredAmount = paymentData.relationships.membership_payment_type.attributes.required_amount;
    const contributionId = paymentData.relationships.membership_payment_type.id;
    const currentValue = paymentData.attributes.current_value;
    const isRequired = paymentData.relationships.membership_payment_type.attributes.is_required;

    return (
        <Fragment>
            <PaymentTitleHeader paymentName={paymentName} isRequired={isRequired} />
            <div className="row">
                <PaymentChart paymentData={paymentData} />
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
        let paymentData = await apiClient.get(`users/${tokenManager.getUserId()}/payments_status`);
        const contribData = await apiClient.get("contribution_fields");
        if (paymentData) {
            const dataParser = new DataParser(paymentData);
            paymentData = dataParser.data;
            const contribIds = getIdsFromArray(contribData.data);
            const includedContribIds = getIdsFromArray(paymentData.included || []);
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
