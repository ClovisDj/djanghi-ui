import {Fragment, useEffect, useState} from "react";
import {isMobile} from "react-device-detect";
import ReactTooltip from "react-tooltip";
import {Button} from "react-bootstrap";
import {v4 as uuidv4} from "uuid";

import {formatValue} from "../../utils/utils";


const overflowOnMobile = isMobile ? "overflow-scroll" : "";

const OptInTableHead = ({ }) => {
    return (
        <Fragment>
            <div className="table-responsive-md admin-payments-table-header">
                <table className="table">
                    <thead>
                        <tr className="d-flex">
                            <th className={"text-start col-4 " + overflowOnMobile} scope="col">Name</th>
                            <th className={"text-center col-4 " + overflowOnMobile} scope="col">Required Amount</th>
                            <th className={"text-end col-4 " + overflowOnMobile} scope="col">Status</th>

                        </tr>
                    </thead>
                </table>
            </div>
        </Fragment>
    );
};


const OptInContribFieldRow = ({ userContribFieldData, handleOptInRequest }) => {
    const contribName = userContribFieldData.attributes.name;
    const requiredAmount = userContribFieldData.attributes.required_amount;
    const [buttonVariant, setButtonVariant] = useState("");
    const [optInStatus, setOptInStatus] = useState("Opt In");
    const [tooltipMessage, setTooltipMessage] = useState("Opt-in to this payment.");
    const tooltipId = uuidv4();

    const variantMap = {
        "Opt In": "primary",
        "PROCESSING": "warning",
        "REQUESTED": "warning",
        "APPROVED": "success",
        "DECLINED": "dander",
    };

    const tooltipMap = {
        "PROCESSING": "Your Admins are processing your request.",
        "REQUESTED": "Your Admins have been notified about your request. You will be notified once it's approved.",
        "APPROVED": "Your request have been approved.",
        "DECLINED": "Your request have been declined by your Admins.",
    };

    useEffect(() => {
        if (userContribFieldData.relationships.userOptIn) {
            setOptInStatus(userContribFieldData.relationships.userOptIn.attributes.state);
            setButtonVariant(variantMap[userContribFieldData.relationships.userOptIn.attributes.state]);
            setTooltipMessage(tooltipMap[userContribFieldData.relationships.userOptIn.attributes.state]);
        } else {
            setButtonVariant(variantMap[optInStatus]);
        }

    }, []);

    const localHandleClick = () => {
        if (optInStatus === "Opt In") {
            handleOptInRequest(userContribFieldData.id);
        }
    };


    return (
        <Fragment>
            <tr className="user-opt-in-status-row d-flex">
                <td className={"user-name-display col-4 " + overflowOnMobile}
                    scope="col">
                    {contribName}
                </td>
                <td className={"user-name-display text-center col-4 " + overflowOnMobile}
                    scope="col">
                        {formatValue(requiredAmount)}
                </td>
                <td className={"user-name-display text-end col-4 " + overflowOnMobile}
                    scope="col">
                    <div className="resend-registration">
                        <ReactTooltip id={tooltipId} className="custom-tooltip" effect="solid" place="top" />
                        <Button variant={buttonVariant}
                                onClick={localHandleClick}
                                data-tip={tooltipMessage}
                                data-for={tooltipId}
                        >
                            {optInStatus}
                        </Button>
                    </div>
                </td>
            </tr>

        </Fragment>
    );
};

const MembershipOptInComponent = ({ contribOptInFields }) => {

    console.log(contribOptInFields);
    const handleOptInRequest = (contribFieldId) => {

    };

    return (
        <Fragment>
            <OptInTableHead />
            <div className="table-responsive-md">
                <table className="table">
                    <tbody>
                        {contribOptInFields && contribOptInFields.length > 0 &&
                            contribOptInFields.map(
                                userContribFieldOptIn => <OptInContribFieldRow key={userContribFieldOptIn.id}
                                                                               userContribFieldData={userContribFieldOptIn}
                                                                               handleOptInRequest={handleOptInRequest} />
                            )
                        }
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
};

export default MembershipOptInComponent;