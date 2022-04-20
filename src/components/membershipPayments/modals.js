import {Fragment, useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";

import {toTitle} from "../../utils/utils";
import PaymentChart from "../dashboard/donutChart";
import PaymentSummary from "../dashboard/paymentSummary";
import {SinglePaymentStatus} from "../dashboard/userPaymentStatus";
import MoreTransactionsModal from "../dashboard/transactionsModal";


export const UserStatusDisplayModal = ({ userContribStatus, userDisplayName, showStatusModal, setShowStatusModal }) => {
    const [paymentName, setPaymentName] = useState("");
    const [requiredAmount, setRequiredAmount] = useState(0);
    const [contributionId, setContributionId] = useState("");
    const [currentValue, setCurrentValue] = useState(0);
    const [selectedUserId, setSelectedUserId] = useState("");

    useEffect(async () => {
        const shouldSetValues = (
            userContribStatus &&
            userContribStatus.relationships &&
            userContribStatus.relationships.hasOwnProperty("membership_payment_type") &&
            userContribStatus.relationships.membership_payment_type
        );
        if (shouldSetValues) {
            setPaymentName(userContribStatus.relationships.membership_payment_type.attributes.name);
            setRequiredAmount(userContribStatus.relationships.membership_payment_type.attributes.required_amount);
            setContributionId(userContribStatus.relationships.membership_payment_type.id);
            setCurrentValue(userContribStatus.attributes.current_value);
            setSelectedUserId(userContribStatus.relationships.user.id);
        }

    }, []);

    return (
        <Fragment>
            <Modal dialogClassName="custom-user-status-detail-modal"
                   size="lg"
                   show={showStatusModal}
                   onHide={() => setShowStatusModal(false)}
                   scrollable={true}
            >
                    <Modal.Header bsPrefix={"custom-modal-header"} closeButton>
                        <Modal.Title id="user-payments-list">
                            <div className="card-title">
                                {userDisplayName}
                            </div>
                          </Modal.Title>
                        </Modal.Header>
                    <Modal.Body bsPrefix={"payments-modal-body"} id={"payments-modal-body"}>
                        {/*<div className="row">*/}
                        {/*    <div className="col">*/}
                        {/*        <PaymentChart paymentData={userContribStatus} />*/}
                        {/*    </div>*/}
                        {/*    <div className="col">*/}
                        {/*        <PaymentSummary*/}
                        {/*            contributionId={contributionId}*/}
                        {/*            currentValue={currentValue}*/}
                        {/*            requiredAmount={requiredAmount}*/}
                        {/*            paymentName={paymentName}*/}
                        {/*        />*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div className="payment-modal-status-wrapper">
                            {/*<MoreTransactionsModal paymentName={paymentName}*/}
                            {/*                       setShowMorePayments={setShowStatusModal}*/}
                            {/*                       showMorePayments={showStatusModal}*/}
                            {/*                       contributionId={contributionId}*/}
                            {/*                       userId={selectedUserId}*/}
                            {/*/>*/}
                            <SinglePaymentStatus paymentData={userContribStatus} />
                        </div>


                    </Modal.Body>
                    <Modal.Footer bsPrefix="custom-modal-footer">
                        <Button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setShowStatusModal(false)}
                        >
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
        </Fragment>
    );
};


