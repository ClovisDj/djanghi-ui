import {Fragment} from "react";
import Chart from "react-apexcharts";
import {formatValue} from "../../utils/utils";


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

export default PaymentChart;
