import {Fragment, useEffect, useState, useContext} from "react";
import {Button, Modal} from "react-bootstrap";

import ApiClient from "../../utils/apiConfiguration";
import TokenManager from "../../utils/authToken";
import {errorToast, successToast} from "../sharedComponents/toaster/toastify";
import {RefreshOptInDataContext} from "./contexts";

const apiClient = new ApiClient();
const tokenManager = new TokenManager();

export const ConfirmOptInModal = ({ showConfirmModal, setShowConfirmModal, selectedContribField }) => {
    const optInRefreshContext = useContext(RefreshOptInDataContext);
    const [contribFieldName, setContribFieldName] = useState("");

    const handleConfirmOptIn = async () => {
        const response = await apiClient.post(
            `users/${tokenManager.getUserId()}/payment-opt-in`,
            {requested_field_id: selectedContribField.id}
        )
        if (response.data) {
            successToast("Request successfully sent!");
            optInRefreshContext.setShouldRefreshOptInData(true);
            setShowConfirmModal(false);
        } else {
            errorToast();
            console.warn(`An unexpected error occurred ${response}`);
        }
    };

    useEffect(() => {
        if (selectedContribField && selectedContribField.attributes) {
            setContribFieldName(selectedContribField.attributes.name);
        }
    }, [selectedContribField]);

    return (
        <Fragment>
            <Modal show={showConfirmModal}
                   onHide={() => setShowConfirmModal(false)}
                   centered={true}
            >
                <Modal.Header bsPrefix={"custom-modal-header"} closeButton>
                    <Modal.Title>
                        <div className="card-title">
                            Confirm your choice
                        </div>
                      </Modal.Title>
                </Modal.Header>
                <Modal.Body bsPrefix={"payments-modal-body"}>
                    <div className="container payment-modal-content">
                        <div className="row title-padding profile-inner-rows below-row-padding">
                            <div className="col user-name-display">
                                You are about to Opt-in to <strong>{contribFieldName}</strong>, please confirm your choice!
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-6 payment-info-text text-center align-middle">
                                <Button type="button"
                                        className="btn-sm btn-primary"
                                        onClick={() => handleConfirmOptIn()}
                                >
                                        Confirm
                                </Button>
                            </div>
                            <div className="col-6 payment-info-text text-center align-middle">
                                <Button type="button"
                                        className="btn-sm btn-secondary"
                                        onClick={() => setShowConfirmModal(false)}
                                >
                                        Cancel
                                </Button>
                            </div>

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer bsPrefix="custom-modal-footer">
                        <Button type="button"
                                className="btn-sm close-button"
                                onClick={() => setShowConfirmModal(false)}
                        >
                            Close
                        </Button>

                    </Modal.Footer>
            </Modal>
        </Fragment>
    );
};
