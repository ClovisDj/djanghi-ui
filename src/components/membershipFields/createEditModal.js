import {Fragment, useState} from "react";
import {Button, Modal} from "react-bootstrap";


const CreateEditModal = ({ modalType, showModal, setShowModal, contribData }) => {
    const attributes = contribData ? contribData.attributes : null;
    const [name, setName] = useState(Boolean(attributes) ? attributes.name : "");
    const [requiredAmount, setRequiredAmount] = useState(Boolean(attributes) ? attributes.required_amount : 0);
    const [isRequired, setIsRequired] = useState(Boolean(attributes) ? attributes.is_required : true);
    const [canOptIn, setCanOptIn] = useState(Boolean(attributes) ? attributes.member_can_opt_in : false);

    const handleHideModal = async () => {
        setShowModal(false);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleIsRequiredChange = (event) => {
        setIsRequired(event.target.checked);
    };

    const handleOptInChange = (event) => {
        setCanOptIn(event.target.checked);
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
                                            <th scope="row" className="card-title text-end">Name:</th>
                                            <td className="text-start">
                                                <input className="form-control"
                                                       type="text"
                                                       maxLength={25}
                                                       value={name}
                                                       onChange={handleNameChange}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="card-title text-end">Is Required:</th>
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
                                        <tr>
                                            <th scope="row" className="card-title text-end">Required Amount:&nbsp; $</th>
                                            <td className="text-start">
                                                <input className="form-control"
                                                       type="number"
                                                       value={requiredAmount}
                                                       onChange={handleRequiredAmountChange}
                                                    />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="card-title text-end">Can Opt-In:</th>
                                            <td className="text-start">
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input"
                                                           type="checkbox"
                                                           value={canOptIn}
                                                           onChange={handleOptInChange}
                                                    />
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
                            onClick={() => handleHideModal()}
                        >
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
        </Fragment>
    );
};

export default CreateEditModal;
