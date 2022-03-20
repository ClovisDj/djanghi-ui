import {Fragment, useEffect, useState} from "react";
import Chart from "react-apexcharts";
import AnimatedNumber from "animated-number-react";

import ApiClient from "../../utils/apiConfiguration";
import TokenManager from "../../utils/authToken";
import {useLocation, useNavigate} from "react-router-dom";
import DataParser, {toTitle} from "../../utils/dataParser";


const SinglePaymentStatus = ({paymentData}) => {
    const paymentName = paymentData.relationships.membership_payment_type.attributes.name;
    const requiredAmount = paymentData.relationships.membership_payment_type.attributes.required_amount;
    const currentValue = paymentData.attributes.current_value;
    const unpaidValue = requiredAmount ? requiredAmount - currentValue : 0;
    const nonRequiredMinPaymentClass = currentValue < 0 ? "need-more-payment" : "no-payment-due";
    const displayCurrentAmount = currentValue < 0 ? -1 * currentValue : currentValue;

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
            verticalAlign: "top",
            containerMargin: {
              left: 50,
              right: 60
            }
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
                                    <div className={"col text-center align-middle align-middle without-min-amount " + `${nonRequiredMinPaymentClass}`}>
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
                                <h5 className="">Summary</h5>
                            </div>
                            <div className="underline" />
                            <div className="row">
                                {requiredAmount > 0 &&
                                    <Fragment>
                                        <div className="col text-center">
                                            <div className="card-title text-center">
                                                <h5 className="">Paid</h5>
                                            </div>
                                        </div>
                                        <div className="col text-center">
                                            <div className="card-title text-center">
                                                <h5 className="">Unpaid</h5>
                                            </div>
                                        </div>
                                    </Fragment>
                                }
                                {requiredAmount <= 0 &&
                                    <Fragment>
                                        <div className="col text-center">
                                            <div className="card-title text-center">
                                                <h5 className="">{requiredAmount <= 0 ? "Unpaid": "Paid"}</h5>
                                            </div>
                                        </div>
                                    </Fragment>
                                }
                            </div>

                            <div className="row">
                                {requiredAmount > 0 &&
                                    <Fragment>
                                        <div className={"col-6 text-center amount-detail no-payment-due"}>
                                            <AnimatedNumber value={displayCurrentAmount} formatValue={formatValue}/>
                                        </div>
                                        <div className={"col-6 text-center amount-detail need-more-payment"}>
                                            <AnimatedNumber value={unpaidValue} formatValue={formatValue}/>
                                        </div>
                                    </Fragment>
                                }
                                {requiredAmount <= 0 &&
                                    <Fragment>
                                        <div className={"col text-center amount-detail " + `${nonRequiredMinPaymentClass}`}>
                                            <AnimatedNumber value={displayCurrentAmount} formatValue={formatValue}/>
                                        </div>
                                    </Fragment>
                                }
                            </div>

                            <div className="card-title text-center">
                                <h5 className="">Last Payment Info</h5>
                            </div>
                            <div className="underline" />

                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};


const UserPaymentStatus = () => {
    const apiClient = new ApiClient();
    const [paymentsStatus, setPaymentsStatus] = useState({data: []});
    const tokenManager = new TokenManager();
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
