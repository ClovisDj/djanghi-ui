import {Fragment, useContext, useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import Select from "react-select";
import AsyncSelect from 'react-select/async'

import ApiClient from "../../utils/apiConfiguration";
import {blueColor, buildUserDisplayName, preventNonNumeric, redColor, whiteColor} from "../../utils/utils";
import {ShouldRefreshPaymentsContext} from "./context";

const apiClient = new ApiClient();

const customStyles = {
    color: whiteColor,
    option: (base, state) => {
        return {
            ...base,
            color: state.data === state.selectProps.value ? whiteColor : "black",
            background: state.data === state.selectProps.value ? blueColor : whiteColor,
            position: "relative !important",
            '&:hover': {
                color: whiteColor,
                background: blueColor
            }
        }
    },
    singleValue: (provided) => ({
        ...provided,
        color: whiteColor,
        background: blueColor,
        paddingLeft: "8px !important",
        borderRadius: "3px !important",
        padding: "2px"
    }),
    multiValue: (provided, state) => {
        return {
            ...provided,
            color: `${whiteColor} !important`,
            fontsize: "20px !important",
            fontWeight: "520 !important",
            background: `${blueColor} !important`,
            borderRadius: "3px !important",
            padding: "2px",
            '&:hover': {
                color: `${whiteColor} !important`,
                background: blueColor
            }
        }
    },
    multiValueLabel: (provided, state) => ({
        ...provided,
        color: `${whiteColor} !important`,
        background: `${blueColor} !important`,
        paddingLeft: "8px !important",
        borderRadius: "3px !important",
        padding: "2px",
    }),
    multiValueRemove: (provided, state) => ({
        ...provided,
        color: `${whiteColor} !important`,
        background: `${blueColor} !important`,
    }),
};

const redCustomStyles = {
    ...customStyles,
    singleValue: (provided) => ({
        ...provided,
        color: whiteColor,
        background: redColor,
        paddingLeft: "8px !important",
        borderRadius: "3px",
        padding: "2px"
    }),
};

const AddPaymentsModal = ({ showPaymentModal, setShowPaymentModal, contribInfo }) => {
    const transactionTypeOptions = [
        {value: "PAYMENT", label: "Credit"},
        {value: "COST", label: "Debit"},
    ];

    const refreshDataContext = useContext(ShouldRefreshPaymentsContext);

    const [isForAllMembers, setIsForAllMembers] = useState(false);
    const [memberOptions, setMemberOptions] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectedTransactionType, setSelectedTransactionType] = useState(transactionTypeOptions[0]);
    const [amount, setAmount] = useState(0);
    const [note, setNote] = useState("");
    const [usersError, setUsersError] = useState("");
    const [amountError, setAmountError] = useState("");

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleTransaction = (transactionTypeChoice) => {
        setSelectedTransactionType(transactionTypeChoice);
    };

    const handleForAllMembers = (event) => {
        setIsForAllMembers(event.target.checked);
    };

    const handleSelections = (selections) => {
        setSelectedMembers(selections);
    };

    const handleNoteChange = (event) => {
        setNote(event.target.value);
    };

    const resetModalData = async () => {
        setIsForAllMembers(false);
        setSelectedMembers([]);
        setSelectedTransactionType(transactionTypeOptions[0]);
        setAmount(0);
        setNote("");
    };

    const handleCloseModal = async () => {
        setShowPaymentModal(false);
        await resetModalData();
    };

    const buildRequestPayload = () => {
        let userIds = [];
        for (let user of selectedMembers) {
            userIds.push(user.value);
        }

        return {
            user_ids: userIds,
            for_all_users: isForAllMembers,
            payment_type: selectedTransactionType.value,
            membership_payment_type_id: contribInfo.value,
            amount: amount,
            note: note,
        };
    };

    const handleSave = async () => {
        const payload = buildRequestPayload();
        const response = await apiClient.post("bulk_membership_payments", payload);
        // setRefreshData(true);
        refreshDataContext.setShouldRefreshData(true);
        await handleCloseModal();
    };

    const fetchUsers = async (searchText = null) => {
        let userOptions = [];
        const searchParams = {search: searchText ? searchText : ""};
        const data = await apiClient.get("users", searchParams);
        if (data.data) {
            for (let user of data.data) {
                const attributes = user.attributes;
                userOptions.push({
                    value: user.id,
                    label: buildUserDisplayName(attributes.first_name, attributes.last_name, attributes.email)
                });
            }
        }
        return userOptions;
    };

    const fetchOptions = async (textInput, callBack) => {
        const foundOptions = await fetchUsers(textInput);
        callBack(foundOptions);
    };

    useEffect(async () => {
        console.log(">>>> Context:", refreshDataContext);
        const initialOptions = await fetchUsers();
        setMemberOptions(initialOptions);
    }, []);

    return (
        <Fragment>
            <Modal contentClassName="add-payments-modal-content"
                   dialogClassName = "add-payments-modal-dialog"
                   show={showPaymentModal}
                   backdrop="static"
                   onHide={handleCloseModal}
                   scrollable={true}
            >
                <Modal.Header bsPrefix={"custom-modal-header"} closeButton>
                    <Modal.Title id="user-payments-list">
                        <div className="card-title">
                            Add Payments
                        </div>
                      </Modal.Title>
                </Modal.Header>
                    <Modal.Body bsPrefix={"payments-modal-body"}>
                        <div className="container payment-modal-content">
                            <div className="row">
                                <div className="col payment-info-text text-start align-middle">Contribution name:</div>
                                <div className="col payment-info-text text-start align-middle">{contribInfo.label}</div>
                            </div>

                            <div className="row inner-rows">
                                <div className="col payment-info-text text-start align-middle">Apply to all members:</div>
                                <div className="col payment-info-text text-start align-middle">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input"
                                               type="checkbox"
                                               checked={isForAllMembers}
                                               value={isForAllMembers}
                                               onChange={handleForAllMembers}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row inner-rows">
                                <div className="col payment-info-text text-start align-middle">Transaction Type:</div>
                                <div className="row user-select-row text-start">
                                    <Select className={"payment-multi-select"}
                                        styles={selectedTransactionType.value === "COST" ? redCustomStyles : customStyles}
                                        onChange={handleTransaction}
                                        options={transactionTypeOptions}
                                        value={selectedTransactionType}
                                    />
                                </div>
                            </div>

                            <div className="row inner-rows">
                                <div className="col payment-info-text text-start align-middle">Amount: &nbsp; $</div>
                                <div className="row user-select-row text-start">
                                    <div className="col">
                                        <input className="form-control payment-amount-input"
                                               type="number"
                                               value={amount}
                                               onChange={handleAmountChange}
                                               onKeyPress={preventNonNumeric}
                                        />
                                    </div>
                                </div>
                            </div>

                            {!isForAllMembers &&
                                <Fragment>
                                    <div className="row inner-rows">
                                        <div className="col payment-info-text text-start align-middle">Member(s):</div>
                                        <div id="users-select-async" className="row user-select-row">
                                                <AsyncSelect className={"payment-multi-select"}
                                                             styles={customStyles}
                                                             name="select users"
                                                             placeholder="Search"
                                                             isSearchable={true}
                                                             loadOptions={fetchOptions}
                                                             onChange={handleSelections}
                                                             options={memberOptions}
                                                             cacheOptions={memberOptions}
                                                             defaultOptions={memberOptions}
                                                             value={selectedMembers}
                                                             isMulti={true}
                                                             closeMenuOnSelect={false}
                                                />
                                        </div>
                                    </div>
                                </Fragment>
                            }

                            <div className="row inner-rows">
                                <div className="col payment-info-text text-start align-middle">Note:</div>
                                <div className="row user-select-row">
                                    <div className="col form-outline">
                                        <textarea className="payment-note"
                                                  value={note}
                                                  onChange={handleNoteChange}
                                                  placeholder="Optional"
                                        />

                                    </div>
                                </div>
                            </div>

                        </div>
                    </Modal.Body>
                    <Modal.Footer bsPrefix="custom-modal-footer">
                        <Button type="button"
                                className="btn-sm btn-secondary mr-auto"
                                onClick={handleCloseModal}
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

export default AddPaymentsModal;


