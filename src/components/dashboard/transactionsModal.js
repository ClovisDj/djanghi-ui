import {Fragment, useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {formatValue, toTitle} from "../../utils/utils";
import InfiniteScroll from "react-infinite-scroll-component";
import ReactTooltip from "react-tooltip";
import ApiClient from "../../utils/apiConfiguration";
import TokenManager from "../../utils/authToken";

const apiClient = new ApiClient();
const tokenManager = new TokenManager();


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
                            <ReactTooltip />
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
                                        {
                                            data.map((payment) => (
                                                <Fragment key={payment.id}>
                                                  <PaymentRow key={payment.id} singlePaymentData={payment} />
                                                </Fragment>
                                            ))
                                        }
                                    </tbody>
                                </table>
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
