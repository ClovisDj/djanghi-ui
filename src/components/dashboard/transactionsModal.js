import {Fragment, useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";

import {formatValue, toTitle} from "../../utils/utils";
import InfiniteScroll from "react-infinite-scroll-component";
import ReactTooltip from "react-tooltip";
import ApiClient from "../../utils/apiConfiguration";
import PageLoader from "../sharedComponents/spinner/pageLoader";


const apiClient = new ApiClient();

const PaymentRow = ({singlePaymentData}) => {
    const transactionType = singlePaymentData.attributes.payment_type === "PAYMENT" ? "Credit" : "Debit";
    const transactionDate = new Date(singlePaymentData.attributes.created_at).toLocaleDateString()
    const amount = singlePaymentData.attributes.amount;
    const note = singlePaymentData.attributes.note;
    const rowClass = transactionType === "Credit" ? "credit-payment" : "debit-payment";

    return (
        <Fragment>
            <tr className={rowClass}>
                <td>{transactionDate}</td>
                <td>{formatValue(amount)}</td>
                <td>{transactionType}</td>
                <td>
                    {note && note.length > 0 &&
                        <a data-tip={note}>
                            <ReactTooltip html={true} className="custom-tooltip" />
                            <button type="button"
                                    className="btn btn-sm btn-secondary"
                            >
                                Click Here!
                            </button>
                        </a>
                    }
                </td>
            </tr>
       </Fragment>
    )};

const MoreTransactionsModal = ({paymentName, showMorePayments, setShowMorePayments, contributionId, userId}) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedUseId, setSelectedUseId] = useState("");
    const [selectedContributionId, setSelectedContributionId] = useState("");
    const [hasMorePayments, setHasMorePayments] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(false);

    const fetchMorePayments = async (user= null) => {
        if ((user || selectedUseId) && selectedContributionId) {
            let currentData = data;
            setIsFetchingData(true);
            const paymentData = await apiClient.get(
                `users/${user? user: selectedUseId}/membership_payments`,
                {
                    contribution_id: selectedContributionId,
                    page: currentPage + 1
                }
            );
            if (paymentData) {
                setData(currentData.concat(paymentData.data));
                setCurrentPage(paymentData.meta.pagination.page);
                setHasMorePayments(paymentData.meta.pagination.page < paymentData.meta.pagination.pages);
            }
            setIsFetchingData(false);
        }
    };

    useEffect(async () => {
        if (showMorePayments) {
            setSelectedUseId(userId);
            setSelectedContributionId(contributionId);
        }
    }, [userId, contributionId, showMorePayments]);

    const handlePreOpen = async (event) => {
        // We fetch the data here to avoid fetching every
        // time we change contribution type in payments page
        await fetchMorePayments();
    };

    const handleExit = (event) => {
        // Here reset the values to the default one so that
        // they will not get mixed up with previously loaded ones
        setSelectedUseId("");
        setData([]);
        setCurrentPage(0);
        setSelectedContributionId("");
        setHasMorePayments(false);
    };

    return (
        <Fragment>
            <Modal
                className="payment-details-modal"
                size="lg"
                show={showMorePayments}
                onHide={() => setShowMorePayments(false)}
                onExit={handleExit}
                onEntering={handlePreOpen}
                scrollable={true}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                    <Modal.Header bsPrefix={"custom-modal-header"} closeButton>
                        <Modal.Title id="user-payments-list">
                            <div className="card-title">
                                {toTitle(paymentName)} -  Payments
                            </div>
                          </Modal.Title>
                        </Modal.Header>
                    <Modal.Body bsPrefix={"payments-modal-body"} id={"payments-modal-body"}>
                        {data.length === 0 && showMorePayments && isFetchingData &&
                            <PageLoader width="5rem" height="5rem" marginTop="5rem" />
                        }
                        <InfiniteScroll
                          dataLength={data.length}
                          next={fetchMorePayments}
                          hasMore={hasMorePayments}
                          pullDownToRefresh={true}
                          refreshFunction={fetchMorePayments}
                          scrollableTarget={"payments-modal-body"}
                          loader={<h4>Loading...</h4>}
                        >
                            <div className="table-responsive payments-table">
                                <table className="table">
                                   <thead>
                                        <tr>
                                          <th scope="col">Date</th>
                                          <th scope="col">Amount</th>
                                          <th scope="col">Type</th>
                                          <th scope="col">Note</th>
                                        </tr>
                                   </thead>
                                    <tbody>
                                        {data.length > 0 && data.map((payment) => (
                                                <Fragment key={payment.id}>
                                                  <PaymentRow singlePaymentData={payment} />
                                                </Fragment>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                {data.length === 0 && !isFetchingData &&
                                    <div className="text-center">No Payments to Display</div>
                                }
                            </div>
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

export default MoreTransactionsModal;
