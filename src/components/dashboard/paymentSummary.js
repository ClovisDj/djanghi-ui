import {Fragment, useEffect, useState} from "react";
import AnimatedNumber from "animated-number-react";
import ReactTooltip from "react-tooltip";
import {v4 as uuidv4} from "uuid";

import MoreTransactionsModal from "./transactionsModal";
import DataParser from "../../utils/dataParser";
import {formatValue} from "../../utils/utils";
import ApiClient from "../../utils/apiConfiguration";
import TokenManager from "../../utils/authToken";


const apiClient = new ApiClient();
const tokenManager = new TokenManager();

const PaymentSummary = ({requiredAmount, contributionId, currentValue, paymentName}) => {
    const unpaidValue = (requiredAmount && requiredAmount > 0) ? Math.abs(requiredAmount - currentValue ): 0;
    const displayCurrentAmount = currentValue;
    const [latestAmountDisplay, setLatestAmountDisplay] = useState(0);
    const [hasAtLeastOnePayment, setHasAtLeastOnePayment] = useState(false);
    const [transactionType, setTransactionType] = useState("Debit");
    const [transactionDate, setTransactionDate] = useState(null);
    const [showMorePayments, setShowMorePayments] = useState(false);
    const [paymentNote, setPaymentNote] = useState("");
    const noteTooltipId = uuidv4();
    const tooltipId = uuidv4();

    useEffect(async () => {
        const paymentData = await apiClient.get(
            `users/${tokenManager.getUserId()}/membership_payments`,
            {
                contribution_id: contributionId
            }
        );
        if (paymentData) {
            const dataParser = await new DataParser(paymentData);
            if (dataParser.data && dataParser.data.data.length > 0) {
                const latestPaymentAmount = dataParser.data.data[0].attributes.amount;
                const transType = dataParser.data.data[0].attributes.payment_type;
                const transDate = dataParser.data.data[0].attributes.created_at;
                const note = dataParser.data.data[0].attributes.note;
                setHasAtLeastOnePayment(true);
                setLatestAmountDisplay(latestPaymentAmount);
                setTransactionType(transType === "PAYMENT" ? "Credit" : "Debit");
                setTransactionDate(new Date(transDate).toLocaleDateString());
                setPaymentNote(note && note.length > 0 ? note : "");

            } else {
                setHasAtLeastOnePayment(false);
            }
        }
    }, []);

    return (
        <Fragment>
            <div className="col-lg-5">
                <div className="card-detail">
                    <div className="card-body">
                        <div className="card-title text-center">
                            <h5>Summary</h5>
                        </div>
                        <div className="underline" />
                            <div className="row">
                                {requiredAmount > 0 &&
                                    <Fragment>
                                        <div className="table-responsive payments-table">
                                            <table className="table table-borderless latest-payment-table">
                                                <tbody>
                                                    <tr>
                                                        <th scope="row" className="payment-info-text">Required Amount</th>
                                                        <td className="text-end">
                                                            <AnimatedNumber value={requiredAmount}
                                                                            formatValue={formatValue}
                                                                            className="no-payment-due"
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row" className="payment-info-text">Total Paid</th>
                                                        <td className="text-end">
                                                            <AnimatedNumber value={displayCurrentAmount}
                                                                            formatValue={formatValue}
                                                                            className={displayCurrentAmount > 0 ? "no-payment-due" : "need-more-payment"}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row" className={currentValue > requiredAmount ? "overpaid-info-text" : "payment-info-text"}>
                                                            {currentValue > requiredAmount ? "OverPaid" : "Unpaid"}
                                                        </th>
                                                        <td className="text-end">
                                                            <AnimatedNumber value={unpaidValue}
                                                                            formatValue={formatValue}
                                                                            className={currentValue > requiredAmount ? "overpaid-display-payment" :
                                                                                (currentValue === requiredAmount ? "no-payment-due": "need-more-payment")}
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </Fragment>
                                }
                                {requiredAmount <= 0 &&
                                    <Fragment>
                                        <div className="table-responsive payments-table">
                                            <table className="table table-borderless latest-payment-table">
                                                <tbody>
                                                    <tr>
                                                        <th scope="row" className={displayCurrentAmount > 0 ? "overpaid-info-text" : "payment-info-text"}>
                                                            {displayCurrentAmount >= 0 ? "OverPaid" : "Unpaid"}
                                                        </th>
                                                        <td className="text-end">
                                                            <AnimatedNumber value={displayCurrentAmount}
                                                                            formatValue={formatValue}
                                                                            className={displayCurrentAmount >= 0 ? "overpaid-display-payment" : "need-more-payment"}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row" className="card-title"> &nbsp;</th>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row" className="card-title"> &nbsp;</th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </Fragment>
                                }
                            </div>

                        <div className="latest-payment-info">
                            <div className="card-title text-center">
                                <h5 className="">Last Transaction Info</h5>
                            </div>

                            <div className="underline" />
                            {hasAtLeastOnePayment &&
                                <Fragment>
                                    <div className="row">
                                        <div className="col payment-detail-row">
                                            <div className="table-responsive payments-table">
                                                <table className="table table-borderless latest-payment-table">
                                                    <tbody>
                                                        <tr>
                                                            <th scope="row" className="payment-info-text">Amount</th>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row" className="payment-info-text">Type</th>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row" className="payment-info-text">Date</th>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row" className="payment-info-text">Note</th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="vertical-separator" />

                                        <div className="col payment-detail-row">
                                            <div className="table-responsive payments-table">
                                                <table className="table table-borderless latest-payment-table">
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-end">
                                                                <AnimatedNumber value={latestAmountDisplay}
                                                                                formatValue={formatValue}
                                                                                className={latestAmountDisplay >= 0 ? "no-payment-due" : "need-more-payment"}
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-end payment-info-text">
                                                                {transactionType}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-end payment-info-text">
                                                                {transactionDate}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-end payment-info-text">
                                                                {paymentNote.length > 0 &&
                                                                    <a data-tip={paymentNote}>
                                                                        <ReactTooltip html={true}
                                                                                      className="custom-tooltip"
                                                                                      id={noteTooltipId}
                                                                                      effect="solid"
                                                                                      place="top"
                                                                        />
                                                                        <i className="fas fa-info-circle note-icon"
                                                                           data-tip={paymentNote}
                                                                           data-for={noteTooltipId}
                                                                        />
                                                                    </a>
                                                                }
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="underline" />

                                    <div className="row more-payment">
                                        <div className="text-center">
                                            <button type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => setShowMorePayments(true)}
                                            >
                                                More Transactions
                                            </button>
                                        </div>
                                    </div>
                                    <ReactTooltip html={true} className="custom-tooltip" id={tooltipId} effect="solid" place="top" />
                                    <MoreTransactionsModal
                                        paymentName={paymentName}
                                        contributionId={contributionId}
                                        showMorePayments={showMorePayments}
                                        setShowMorePayments={setShowMorePayments}
                                        userId={tokenManager.getUserId()}
                                        tooltipId={tooltipId}
                                    />
                                </Fragment>
                            }

                            {!hasAtLeastOnePayment &&
                                <div className="row no-payment">
                                    <div className="col payment-info-text text-center">
                                        No Payment To Display!
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default PaymentSummary;
