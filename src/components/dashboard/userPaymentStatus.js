import {Fragment, useEffect, useState} from "react";
import Chart from "react-apexcharts";
import AnimatedNumber from "animated-number-react";

import ApiClient from "../../utils/apiConfiguration";
import TokenManager from "../../utils/authToken";
import {useLocation} from "react-router-dom";
import DataParser, {toTitle} from "../../utils/dataParser";


const apiClient = new ApiClient();
const tokenManager = new TokenManager();

const SinglePaymentStatus = ({paymentData}) => {
    const paymentName = paymentData.relationships.membership_payment_type.attributes.name;
    const requiredAmount = paymentData.relationships.membership_payment_type.attributes.required_amount;
    const contributionId = paymentData.relationships.membership_payment_type.id;
    const currentValue = paymentData.attributes.current_value;
    const unpaidValue = requiredAmount ? requiredAmount - currentValue : 0;
    const nonRequiredMinPaymentClass = currentValue < 0 ? "need-more-payment" : "no-payment-due";
    const displayCurrentAmount = currentValue < 0 ? -1 * currentValue : currentValue;
    const [latestPaymentDisplayClass, setLatestPaymentDisplayClass] = useState("no-payment-due");
    const [latestAmountDisplay, setLatestAmountDisplay] = useState(0);
    const [hasAtLeastOnePayment, setHasAtLeastOnePayment] = useState(true);
    const [transactionType, setTransactionType] = useState("Debit");
    const [transactionDate, setTransactionDate] = useState(null);

    const formatValue = value => `$ ${Number(value).toFixed(2)}`;

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
                setLatestPaymentDisplayClass(latestPaymentAmount < 0 ? "need-more-payment" : "no-payment-due");
                setLatestAmountDisplay(latestPaymentAmount < 0 ? -1 * latestPaymentAmount : latestPaymentAmount);
                setTransactionType(transType === "PAYMENT" ? "Credit" : "Debit");
                setTransactionDate(new Date(transDate).toLocaleDateString());
            } else {
                setHasAtLeastOnePayment(false);
            }

        }
    }, []);

    return (
        <Fragment>
            <div className="row payment-title-row">
                <div className="col">
                    <div className="title-card align-bottom">
                        <h5 className="card-title card-title-text text-center align-bottom">{toTitle(paymentName)}</h5>
                    </div>
                </div>
            </div>

            <div className="row">
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
                                                <p className={"text-center no-payment-due"}>
                                                   <AnimatedNumber value={displayCurrentAmount} formatValue={formatValue} className="no-payment-due"/>
                                                </p>
                                            </div>
                                            <div className={"col-6 text-center payment-detail"}>
                                                <p className={"text-center need-more-payment"}>
                                                    <AnimatedNumber value={unpaidValue} formatValue={formatValue}/>
                                                </p>
                                            </div>
                                        </Fragment>
                                    }
                                    {requiredAmount <= 0 &&
                                        <Fragment>
                                            <div className={"col text-center payment-detail"}>
                                                <p className={"text-center " + nonRequiredMinPaymentClass}>
                                                    <AnimatedNumber value={displayCurrentAmount} formatValue={formatValue} className={nonRequiredMinPaymentClass}/>
                                                </p>
                                            </div>
                                        </Fragment>
                                    }
                                </div>
                            </div>

                            <div className="latest-payment-info">
                                <div className="card-title text-center">
                                    <h5 className="">Last Payment Info</h5>
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
                                                        <AnimatedNumber value={latestAmountDisplay} formatValue={formatValue} className={latestPaymentDisplayClass}/>
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