import {Fragment} from "react";
import {Button, Modal} from "react-bootstrap";
import ApiClient from "../../utils/apiConfiguration";

const apiClient = new ApiClient();

const ConfirmResendRegistrationModal = ({ userDisplayName, userEmail,  showResendConfirm, setShowResendConfirm }) => {

    const resendRegistration = async (event) => {
        event.stopPropagation();
        event.preventDefault();

        const resendLinkData = {
            email: userEmail,
            should_send_activation: true,
        };
        await apiClient.post("registrations", resendLinkData);
        setShowResendConfirm(false);
    };

    const handleDismiss = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setShowResendConfirm(false);

    };

    return (
        <Fragment>
            <Modal contentClassName="add-payments-modal-content"
                   show={showResendConfirm}
                   onHide={() => setShowResendConfirm(false)}
                   centered={true}
            >
                <Modal.Header bsPrefix={"custom-modal-header"} closeButton>
                    <Modal.Title id="user-payments-list">
                        <div className="card-title">
                            Resend Registration Invite
                        </div>
                      </Modal.Title>
                </Modal.Header>
                <Modal.Body bsPrefix={"payments-modal-body"}>
                    <div className="container payment-modal-content">
                        <div className="row">
                            <div className="col payment-info-text text-center align-middle">
                                Are you sure you want to resend the registration invite to <strong>{userDisplayName}</strong>?
                            </div>
                        </div>
                        <div className="row inner-rows">
                            <div className="col-6 payment-info-text text-center align-middle">
                                <Button type="button"
                                        className="btn-sm btn-secondary"
                                        onClick={resendRegistration}
                                >
                                        Yes
                                </Button>
                            </div>
                            <div className="col-6 payment-info-text text-center align-middle">
                                <Button type="button"
                                        className="btn-sm btn-secondary"
                                        onClick={handleDismiss}
                                >
                                        No
                                </Button>
                            </div>

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer bsPrefix="custom-modal-footer">
                        <Button type="button"
                                className="btn-sm close-button"
                                onClick={handleDismiss}
                        >
                            Close
                        </Button>

                    </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default ConfirmResendRegistrationModal;
