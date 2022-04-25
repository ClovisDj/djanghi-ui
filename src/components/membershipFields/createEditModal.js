import {Fragment, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';

import ApiClient from "../../utils/apiConfiguration";

const apiClient = new ApiClient();

const CreateEditModal = ({ modalType, showModal, setShowModal, contribData, shouldRefreshData, setShouldRefreshData }) => {
    const attributes = contribData ? contribData.attributes : null;
    const [name, setName] = useState(Boolean(attributes) ? attributes.name : "");
    const [requiredAmount, setRequiredAmount] = useState(Boolean(attributes) ? attributes.required_amount : 0);
    const [isRequired, setIsRequired] = useState(Boolean(attributes) ? attributes.is_required : true);
    const [canOptIn, setCanOptIn] = useState(Boolean(attributes) ? attributes.member_can_opt_in : false);
    const [errorToDisplay, setErrorToDisplay] = useState("");
    const [requiredAmountIsDisabled, setRequiredAmountIsDisabled] = useState(false);
    const [canOptInIsDisabled, setCanOptInIsDisabled] = useState(true);

    const handleSave = async () => {
        const endpoint = contribData ? `contribution_fields/${contribData.id}` : "contribution_fields";
        const httpMethod = contribData ? "patch" : "post";
        const requestData = {
            name: name,
            is_required: isRequired,
            required_amount: requiredAmount,
            member_can_opt_in: canOptIn
        };

        const data = await apiClient[httpMethod](endpoint, requestData);
        if (data.hasOwnProperty("errors")) {
            setErrorToDisplay(data.errors[0].detail);
        } else {
            setShowModal(false);
            setShouldRefreshData(uuidv4());
        }
    };

    const handleHideModal = () => {
        setShowModal(false);
    };

    const handleNameChange = (event) => {
        setErrorToDisplay("");
        setName(event.target.value);
    };

    const handleIsRequiredChange = (event) => {
        setIsRequired(event.target.checked);
        if (event.target.checked) {
            setRequiredAmountIsDisabled(false);
            setCanOptInIsDisabled(true);
            setCanOptIn(false);
        } else {
            setRequiredAmountIsDisabled(true);
            setCanOptInIsDisabled(false);
            setRequiredAmount(0);
        }
    };

    const handleOptInChange = (event) => {
        setCanOptIn(event.target.checked);
        if (event.target.checked) {
            setRequiredAmountIsDisabled(false);
            setRequiredAmount(0);
        } else if (isRequired) {
            setRequiredAmountIsDisabled(false);
            setRequiredAmount(0);
        } else if (!isRequired) {
            setRequiredAmountIsDisabled(true);
            setRequiredAmount(0);
        }
    };

    const handleRequiredAmountChange = (event) => {
        setRequiredAmount(event.target.value);
    };

    return (
        <Fragment>
            <Modal
                className="payment-details-modal"
                size="md"
                show={showModal}
                onHide={() => handleHideModal()}
                scrollable={true}
                backdrop="static"
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header bsPrefix={"custom-modal-header"} closeButton>
                    <Modal.Title id="user-payments-list">
                        <div className="card-title">
                            {modalType}
                        </div>
                      </Modal.Title>
                    </Modal.Header>
                <Modal.Body bsPrefix={"payments-modal-body"} id={"contrib-modal-body"}>
                    <form>
                        <div className="">
                            <div className="table-responsive payments-table">
                                <table id="contrib-card" className="table table-borderless latest-payment-table">
                                    <tbody>
                                        <tr>
                                            <th scope="row" className="payment-info-text text-start">Name</th>
                                            <td className="text-start">
                                                <input className="form-control"
                                                       type="text"
                                                       maxLength={30}
                                                       value={name}
                                                       onChange={handleNameChange}
                                                       required={true}
                                                />
                                                {errorToDisplay &&
                                                        <div className="error-display">
                                                            {errorToDisplay}
                                                        </div>
                                                    }
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="payment-info-text text-start">Is Required</th>
                                            <td className="text-start">
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input"
                                                           type="checkbox"
                                                           checked={isRequired}
                                                           value={isRequired}
                                                           onChange={handleIsRequiredChange}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr scope="col">
                                            <th scope="row" className="payment-info-text text-start">Required Amount</th>
                                            <td className="text-start">
                                                {!requiredAmountIsDisabled &&
                                                    <div className="required-amount">
                                                        <span className="payment-info-text">$</span>
                                                        <input className="form-control"
                                                           type="number"
                                                           value={requiredAmount}
                                                           onChange={handleRequiredAmountChange}
                                                        />
                                                    </div>

                                                }
                                                {requiredAmountIsDisabled &&
                                                    <input className="form-control"
                                                           type="number"
                                                           value={requiredAmount}
                                                           placeholder={requiredAmount}
                                                           readOnly={true}
                                                    />
                                                }

                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="payment-info-text text-start">Members can Opt-In</th>
                                            <td className="text-start">
                                                <div className="form-check form-switch">
                                                    {!canOptInIsDisabled &&
                                                        <input className="form-check-input"
                                                               type="checkbox"
                                                               value={canOptIn}
                                                               checked={canOptIn}
                                                               onChange={handleOptInChange}
                                                        />
                                                    }
                                                    {canOptInIsDisabled &&
                                                        <input className="form-check-input"
                                                               type="checkbox"
                                                               checked={canOptIn}
                                                               readOnly={true}
                                                        />
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </form>

                </Modal.Body>
                    <Modal.Footer bsPrefix="custom-modal-footer">
                        <Button type="button"
                                className="btn-sm btn-secondary mr-auto"
                                onClick={() => handleHideModal()}
                        >
                            Close
                        </Button>
                        <Button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleSave()}
                        >
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
        </Fragment>
    );
};

export default CreateEditModal;
