import {Fragment, useEffect, useState} from "react";
import Chart from "react-apexcharts";
import AnimatedNumber from "animated-number-react";

import ApiClient from "../../utils/apiConfiguration";
import TokenManager from "../../utils/authToken";
import {useLocation} from "react-router-dom";
import DataParser, {formatValue, toTitle} from "../../utils/dataParser";
import {Button, Modal} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";


const apiClient = new ApiClient();
const tokenManager = new TokenManager();


const PaymentChart = ({paymentData}) => {
    const requiredAmount = paymentData.relationships.membership_payment_type.attributes.required_amount;
    const currentValue = paymentData.attributes.current_value;
    const nonRequiredMinPaymentClass = currentValue < 0 ? "need-more-payment" : "no-payment-due";
    const displayCurrentAmount = currentValue;
    const series = (typeof requiredAmount === "number") ? [currentValue, requiredAmount - currentValue] : [];
    const options = {
        dataLabels: {
          enabled: true
        },
        colors: [
            "rgb(54, 162, 235)",
            "rgb(253,82,116)",
        ],
        labels: [`Paid`, `Unpaid`],
        plotOptions: {
            pie: {
                expandOnClick: false,
                donut: {
                size: "50px"
            },
            }
        },
        legend: {
            position: "bottom",
            verticalAlign: "top"
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        height: 400
                    },
                },
                legend: {
                    position: "bottom"
                }
            }
        ]
    }

    return (
        <Fragment>
            <div className="col-lg-7">
                <div className="card-chart">
                    <div className="card-body">

                        {requiredAmount > 0 &&
                            <div className="card-title">
                                <h5 >Chart</h5>
                            </div>
                        }

                        {requiredAmount > 0 &&
                            <div id={`donutChart-${paymentData.id}`}>
                                <Chart options={options} series={series} type="donut" height="400px" width={"100%"}/>
                            </div>
                        }

                        {requiredAmount <= 0 &&
                            <div className="row">
                                <div className={"col text-center align-middle without-min-amount " + `${nonRequiredMinPaymentClass}`}>
                                    <span>
                                        {formatValue(displayCurrentAmount)}
                                    </span>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    )
};

const PaymentRow = ({singlePaymentData}) => {
    const transactionType = singlePaymentData.attributes.payment_type === "PAYMENT" ? "Credit" : "Debit";
    const transactionDate = new Date(singlePaymentData.attributes.created_at).toLocaleDateString()
    const amount = singlePaymentData.attributes.amount;
    const note = singlePaymentData.attributes.note;

    return (
        <Fragment>
            <div className="row payment-row">
                <div className="col text-center overflowX">
                    {transactionDate}
                </div>
                <div className="col text-center overflowX">
                    {formatValue(amount)}
                </div>
                <div className="col text-center overflowX">
                    {transactionType}
                </div>
                <div className="col text-center overflowX">
                    {note}
                </div>
            </div>
       </Fragment>
    )};

const MoreTransactionsModal = ({paymentName, showMorePayments, setShowMorePayments, contributionId}) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMorePayments, setHasMorePayments] = useState(true);

    const fetchMorePayments = async () => {
        let currentData = data;
        const paymentData = await apiClient.get(
            `users/${tokenManager.getUserId()}/membership_payments`,
            {
                contribution_id: contributionId,
                page: currentPage + 1
            }
        );
        if (paymentData) {
            setData(currentData.concat(paymentData.data));
            setCurrentPage(paymentData.meta.pagination.page);
            setHasMorePayments(paymentData.meta.pagination.page < paymentData.meta.pagination.pages);
        }
    };

    useEffect(async () => {
        await fetchMorePayments();
    }, []);

    return (
        <Fragment>
            <Modal
                className="payment-details-modal"
                size="lg"
                show={showMorePayments}
                onHide={() => setShowMorePayments(false)}
                scrollable={true}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                    <Modal.Header bsPrefix={"custom-modal-header"} closeButton>
                        <Modal.Title id="user-payments-list">
                            <div className="card-title">
                                {toTitle(paymentName)} Payments
                            </div>
                          </Modal.Title>
                        </Modal.Header>
                    <Modal.Body bsPrefix={"payments-modal-body"} id={"payments-modal-body"}>
                        <div className="row payment-modal-header sticky-top">
                            <div className="col">
                                <p className="text-center">Date</p>
                            </div>
                            <div className="col">
                                <p className="text-center">Amount</p>
                            </div>
                            <div className="col">
                                <p className="text-center">Type</p>
                            </div>
                            <div className="col">
                                <p className="text-center">Note</p>
                            </div>
                        </div>

                        <InfiniteScroll
                          dataLength={data.length}
                          next={fetchMorePayments}
                          hasMore={hasMorePayments}
                          pullDownToRefresh={true}
                          refreshFunction={fetchMorePayments}
                          scrollableTarget={"payments-modal-body"}
                          loader={<p>Loading...</p>}
                        >
                            {
                                data.map((payment) => (
                                    <Fragment key={payment.id}>
                                      <PaymentRow key={payment.id} singlePaymentData={payment} />
                                    </Fragment>
                                ))
                            }
                        </InfiniteScroll>

                    </Modal.Body>
                    <Modal.Footer bsPrefix="custom-modal-footer">
                        <Button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setShowMorePayments(false)}
                        >
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
        </Fragment>
    );
};


const PaymentSummary = ({requiredAmount, contributionId, currentValue, paymentName}) => {
    const unpaidValue = requiredAmount ? - (requiredAmount - currentValue ): 0;
    const nonRequiredMinPaymentClass = currentValue < 0 ? "need-more-payment" : "no-payment-due";
    const displayCurrentAmount = currentValue;
    const [latestPaymentDisplayClass, setLatestPaymentDisplayClass] = useState("no-payment-due");
    const [latestAmountDisplay, setLatestAmountDisplay] = useState(0);
    const [hasAtLeastOnePayment, setHasAtLeastOnePayment] = useState(true);
    const [transactionType, setTransactionType] = useState("Debit");
    const [transactionDate, setTransactionDate] = useState(null);
    const [showMorePayments, setShowMorePayments] = useState(false);
    const [paymentsData, setPaymentsData] = useState(null);

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
                setPaymentsData(dataParser.data);
                const latestPaymentAmount = dataParser.data.data[0].attributes.amount;
                const transType = dataParser.data.data[0].attributes.payment_type;
                const transDate = dataParser.data.data[0].attributes.created_at;
                setLatestPaymentDisplayClass(latestPaymentAmount < 0 ? "need-more-payment" : "no-payment-due");
                setLatestAmountDisplay(latestPaymentAmount);
                setTransactionType(transType === "PAYMENT" ? "Credit" : "Debit");
                setTransactionDate(new Date(transDate).toLocaleDateString());
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
                        <div>
                            <div className="row">
                                {requiredAmount > 0 &&
                                    <Fragment>
                                        <div className="col text-center">
                                            <div className="card-title text-center">
                                                <h5>Paid</h5>
                                            </div>
                                        </div>
                                        <div className="col text-center">
                                            <div className="card-title text-center">
                                                <h5>Unpaid</h5>
                                            </div>
                                        </div>
                                    </Fragment>
                                }
                                {requiredAmount <= 0 &&
                                    <Fragment>
                                        <div className="col text-center">
                                            <div className="card-title text-center">
                                                <h5>{requiredAmount <= 0 ? "Unpaid": "Paid"}</h5>
                                            </div>
                                        </div>
                                    </Fragment>
                                }
                            </div>
                            <div className="row">
                                {requiredAmount > 0 &&
                                    <Fragment>
                                        <div className={"col-6 text-center payment-detail"}>
                                            <p className={"text-center"}>
                                               <AnimatedNumber value={displayCurrentAmount}
                                                               formatValue={formatValue}
                                                               className="no-payment-due"
                                               />
                                            </p>
                                        </div>
                                        <div className={"col-6 text-center payment-detail"}>
                                            <p className={"text-center"}>
                                                <AnimatedNumber value={unpaidValue}
                                                                formatValue={formatValue}
                                                                className="need-more-payment"
                                                />
                                            </p>
                                        </div>
                                    </Fragment>
                                }
                                {requiredAmount <= 0 &&
                                    <Fragment>
                                        <div className={"col text-center payment-detail"}>
                                            <p className={"text-center " + nonRequiredMinPaymentClass}>
                                                <AnimatedNumber value={displayCurrentAmount}
                                                                formatValue={formatValue}
                                                                className={nonRequiredMinPaymentClass}
                                                />
                                            </p>
                                        </div>
                                    </Fragment>
                                }
                            </div>
                        </div>

                        <div className="latest-payment-info">
                            <div className="card-title text-center">
                                <h5 className="">Last Transaction Info</h5>
                            </div>

                            <div className="underline" />
                            {hasAtLeastOnePayment &&
                                <Fragment>
                                    <div className="row payment-detail-row">
                                        <div className="col-6">
                                            <div className="payment-detail">
                                                <p className="text-center">Amount</p>
                                            </div>
                                            <div className="payment-detail">
                                                <p className="text-center">Type</p>
                                            </div>
                                            <div className="payment-detail">
                                                <p className="text-center">Date</p>
                                            </div>
                                        </div>

                                        <div className="col-2 vertical-separator"/>

                                        <div className="col-4">
                                            <div className={"payment-detail"}>
                                                <p className={"text-center"}>
                                                    <AnimatedNumber value={latestAmountDisplay}
                                                                    formatValue={formatValue}
                                                                    className={latestPaymentDisplayClass}
                                                    />
                                                </p>

                                            </div>
                                            <div className="payment-detail">
                                                <p className="text-center">{transactionType}</p>
                                            </div>

                                            <div className="payment-detail">
                                                <p className="text-center">{transactionDate}</p>
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
                                    <MoreTransactionsModal
                                        paymentName={paymentName}
                                        contributionId={contributionId}
                                        showMorePayments={showMorePayments}
                                        setShowMorePayments={setShowMorePayments}
                                    />
                                </Fragment>
                            }

                            {!hasAtLeastOnePayment &&
                                <div className="row">
                                    <div className="no-payment">
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
