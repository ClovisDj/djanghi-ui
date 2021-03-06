import {Fragment, useEffect, useState} from "react";
import {formatValue} from "../../utils/utils";
import {Button} from "react-bootstrap";
import CreateEditModal from "./createEditModal";


const SingleContributionDisplay = ({ contribution, shouldRefreshData, setShouldRefreshData }) => {
    const [name, setName] = useState("");
    const [isRequired, setIsRequired] = useState(contribution ? contribution.attributes.is_required : true);
    const [canOptIn, setCanOptIn] = useState(contribution ? contribution.attributes.member_can_opt_in : false);
    const [requiredAmount, setRequiredAmount] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(async () => {
        setName(contribution.attributes.name);
        setIsRequired(contribution.attributes.is_required);
        setCanOptIn(contribution.attributes.member_can_opt_in);
        if (contribution.attributes.required_amount) {
            setRequiredAmount(contribution.attributes.required_amount);
        }
    }, []);

    const openEditModal = () => {
        setShowEditModal(true);
    };

    const handleClickArchive = () => {
        // setShowEditModal(true);
    };

    return (
        <Fragment>
            <div className="col-lg-4">
                <div className="contrib-card">
                    <div className="table-responsive contrib-table-div">
                        <table id="contrib-card" className="table table-borderless">
                            <tbody>
                                <tr>
                                    <th scope="row" className="card-title text-start">Name:</th>
                                    <td className="payment-info-text text-start">{name}</td>
                                </tr>
                                <tr>
                                    <th scope="row" className="card-title text-start">Is Required:</th>
                                    <td className="text-start">
                                        <div className="form-check form-switch">
                                            <input className="form-check-input"
                                                   type="checkbox"
                                                   checked={isRequired}
                                                   readOnly={true}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" className="card-title text-start">Required Amount:</th>
                                    <td className="text-start no-payment-due">
                                        <h5>{formatValue(requiredAmount)}</h5>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" className="card-title text-start">Can Opt-In:</th>
                                    <td className="text-start">
                                        <div className="form-check form-switch">
                                            <input className="form-check-input"
                                                   type="checkbox"
                                                   checked={canOptIn}
                                                   readOnly={true}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="table-responsive payments-table">
                        <table id="contrib-card" className="table table-borderless latest-payment-table">
                            <tbody>
                                <tr>
                                    <th scope="row" className="card-title text-start">
                                        <Button type="button"
                                                className="btn-sm btn-danger"
                                                onClick={() => handleClickArchive()}
                                        >
                                            Archive
                                        </Button>
                                    </th>
                                    <td className="text-end">
                                        <Button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => openEditModal()}
                                        >
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showEditModal &&
                <CreateEditModal modalType={"Edit Contribution Field"}
                                 showModal={showEditModal}
                                 setShowModal={setShowEditModal}
                                 contribData={contribution}
                                 shouldRefreshData={shouldRefreshData}
                                 setShouldRefreshData={setShouldRefreshData}
                />
            }

        </Fragment>
    );
};

export default SingleContributionDisplay;