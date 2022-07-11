import {Button, Modal} from "react-bootstrap";
import {Fragment, useContext, useEffect, useState} from "react";

import ApiClient from "../../utils/apiConfiguration";
import {RefreshUsersContext} from "./contexts";
import TokenManager from "../../utils/authToken";
import {successToast} from "../sharedComponents/toaster/toastify";
import {UserDataContext} from "../../app/contexts";

const apiClient = new ApiClient();
const tokenManager = new TokenManager();

export const AdminRolesModal = ({ displayName, userData, showModal, setShowModal, isAddRole }) => {
    const refreshDataContext = useContext(RefreshUsersContext);
    const [isFullAdmin, setIsFullAdmin] = useState(false);
    const [authUserIsCurrent, setAuthUserIsCurrent] = useState(false);
    const [isPaymentManager, setIsPaymentManager] = useState(false);

    const rolesMap = {
        A: () => setIsFullAdmin(true),
        B: () => setIsPaymentManager(true),
    };

    useEffect(async () => {
        await setAuthUserIsCurrent(tokenManager.getUserId() === userData.id);
        for (let role of userData.attributes.roles) {
            try {
                rolesMap[role.value]();
            } catch (e) {}

        }
    }, []);

    const handleCloseModal = async () => {
        await setShowModal(false);
    };

    const handleSave = async () => {
        let requestRoles = [];
        if (isFullAdmin) requestRoles.push("A");
        if (isPaymentManager) requestRoles.push("B");

        const response = await apiClient.post(`users/${userData.id}/admin`, {roles: requestRoles});

        if (!response.errors) {
            await refreshDataContext.resetPageParams();
            await refreshDataContext.setShouldRefreshData(true);
            await setShowModal(false);
        }
    };

     return (
        <Fragment>
            <Modal contentClassName={""}
                   show={showModal}
                   backdrop="static"
                   onHide={handleCloseModal}
                   scrollable={true}
            >
                <Modal.Header bsPrefix={"custom-modal-header"} closeButton>
                    <Modal.Title id="user-payments-list">
                        {isAddRole &&
                            <div className="card-title">Modify Admin - {displayName}</div>
                        }
                        {!isAddRole &&
                            <div className="card-title">Make Admin - {displayName}</div>
                        }
                      </Modal.Title>
                </Modal.Header>
                <Modal.Body bsPrefix={"payments-modal-body"}>
                    <div className="row">
                        <div className="col-6 payment-info-text text-start align-middle">Full Admin</div>
                        <div className="col-6 payment-info-text text-start align-middle">
                            <div className="form-check form-switch">
                                <input className="form-check-input"
                                       type="checkbox"
                                       checked={isFullAdmin}
                                       value={isFullAdmin}
                                       disabled={authUserIsCurrent}
                                       onChange={(e) => setIsFullAdmin(e.target.checked)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row inner-rows">
                        <div className="col-6 payment-info-text text-start align-middle">Payment Manager</div>
                        <div className="col-6 payment-info-text text-start align-middle">
                            <div className="form-check form-switch">
                                <input className="form-check-input"
                                       type="checkbox"
                                       checked={isPaymentManager}
                                       value={isPaymentManager}
                                       onChange={(e) => setIsPaymentManager(e.target.checked)}
                                />
                            </div>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer bsPrefix="custom-modal-footer">
                    <Button type="button"
                            className="btn-sm close-button"
                            onClick={handleCloseModal}
                    >
                        Close
                    </Button>
                    <Button
                        className="btn btn-sm save-button"
                        onClick={async () => await handleSave()}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
     );
};

const UserProfileModalComponent = ({ userData, showModal, setShowModal, isCreate= false }) => {
    const refreshDataContext = useContext(RefreshUsersContext);
    const userDataContext = useContext(UserDataContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState();
    const [cityOfBirth, setCityOfBirth] = useState("");
    const [countryOfBirth, setCountryOfBirth] = useState("");
    const [female, setFemale] = useState(false);
    const [male, setMale] = useState(false);
    const [unspecified, setUnspecified] = useState(false);
    const [sendRegistrationLink, setSendRegistrationLink] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");


    const sexChoicesMap = {
        F: (choice) => setFemale(choice === "F"),
        M: (choice) => setMale(choice === "M"),
        U: (choice) => setUnspecified(choice === "U"),
    };

    useEffect(async () => {
        if (userData && userData.attributes) {
            const attributes = userData.attributes;
            setFirstName(attributes.first_name ? attributes.first_name : "");
            setLastName(attributes.last_name ? attributes.last_name : "");
            setAddress(attributes.address ? attributes.address : "");
            setEmail(attributes.email ? attributes.email : "");
            setDateOfBirth(attributes.date_of_birth ? attributes.date_of_birth : "");
            setCityOfBirth(attributes.city_of_birth ? attributes.city_of_birth : "");
            setCountryOfBirth(attributes.country_of_birth ? attributes.country_of_birth : "");
            setFemale(attributes.sex === "F");
            setMale(attributes.sex === "M");
            setUnspecified(attributes.sex === "U");

        }
    }, [userData]);

        useEffect(() => {
        if (userDataContext.user) {
            tokenManager.storeAuthUser(userDataContext.user);
        }
    }, [userDataContext.user]);

    const handleCloseModal = async () => {
        setShowModal(false);
        await clearModalContent();

    };

    const handleUserSexChoice = (choice) => {
        Object.keys(sexChoicesMap).forEach((sexType) => sexChoicesMap[sexType](choice));
    };

    const clearModalContent = async () => {
        setEmail("");
        setFirstName("");
        setLastName("");
        setSendRegistrationLink(true);
        clearErrorMessage();
    };

    const clearErrorMessage = () => {
        if (errorMessage) {
            setErrorMessage("");
        }
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        clearErrorMessage();
    };

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
        clearErrorMessage();
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
        clearErrorMessage();
    };

    const buildRequestPayload = async () => {
        let payload = {
            first_name: firstName ? firstName : "",
            last_name: lastName ? lastName : "",
            address: address ? address : null,
            date_of_birth: dateOfBirth ? dateOfBirth : null,
            city_of_birth: cityOfBirth ? cityOfBirth : null,
            country_of_birth: countryOfBirth ? countryOfBirth : null,
        };

        if (isCreate) {
            payload.email = email;
            payload.first_name = payload.first_name ? payload.first_name : "";
            payload.last_name = payload.last_name ? payload.last_name : "";
            payload.should_send_activation = sendRegistrationLink;
        }

        [[female, "F"], [male, "M"], [unspecified, "U"]].forEach((sexOption) => {
            if (sexOption[0]) {
                payload.sex = sexOption[1];
            }
            return sexOption;
        });

        return payload;
    };

    const validateData = async () => {
        let isValid = true;
        if (isCreate) {
            if (!email) {
                setErrorMessage("You need to provide a valid email address.");
                isValid = false;
            }
        }
        return isValid;
    };

    const handleSave = async () => {
        const toastMessage = isCreate ? "Successfully Sent Registration!" : "Successfully Saved Changes!";
        const requestMethod = isCreate ? "post" : "patch";
        const requestEndPoint = isCreate ? "registrations" : `users/${userData.id}`;
        const authorIsUser = userData && tokenManager.getUserId() === userData.id;
        const requestData = await buildRequestPayload();

        const dataIsValid = await validateData();
        if (dataIsValid) {
            const userResponseData = await apiClient[requestMethod](requestEndPoint, requestData);

            if (userResponseData.data) {
                await refreshDataContext.resetPageParams();
                await refreshDataContext.setShouldRefreshData(true);
                if (authorIsUser) {
                    userDataContext.setUser(userResponseData);
                }
                await handleCloseModal();
                successToast(toastMessage);
            } else if (userResponseData.errors) {
                setErrorMessage(userResponseData.errors[0].detail);
            }
        }
    };

    return (
        <Fragment>
            <Modal contentClassName={!isCreate ? "add-payments-modal-content" : ""}
                   show={showModal}
                   backdrop="static"
                   onHide={handleCloseModal}
                   scrollable={true}
            >
                <Modal.Header bsPrefix={"custom-modal-header"} closeButton>
                    <Modal.Title id="user-payments-list">
                        <div className="card-title">{isCreate ? "Register a new user" : "User Profile"}</div>
                      </Modal.Title>
                </Modal.Header>
                    <Modal.Body bsPrefix={"payments-modal-body"}>
                         <div className="container payment-modal-content">
                             <div className="row">
                                 <div className="col-4 payment-info-text text-start align-middle">
                                     Email
                                 </div>
                                 <div className="col-8 payment-info-text text-start align-middle">
                                     <input type="text"
                                            className="form-control custom-input"
                                            value={email}
                                            placeholder="(required)"
                                            disabled={!isCreate}
                                            onChange={handleEmailChange}
                                     />
                                 </div>
                             </div>
                             <div className="row inner-rows">
                                 <div className="col-4 payment-info-text text-start align-middle">
                                     First Name
                                 </div>
                                 <div className="col-8 payment-info-text text-start align-middle">
                                     <input type="text"
                                            className="form-control custom-input"
                                            value={firstName}
                                            placeholder="(optional)"
                                            maxLength={120}
                                            onChange={handleFirstNameChange}
                                     />
                                 </div>
                             </div>
                             <div className="row inner-rows">
                                 <div className="col-4 payment-info-text text-start align-middle">
                                     Last Name
                                 </div>
                                 <div className="col-8 payment-info-text text-start align-middle">
                                     <input type="text"
                                            className="form-control custom-input"
                                            maxLength={120}
                                            placeholder="(optional)"
                                            value={lastName}
                                            onChange={handleLastNameChange}
                                     />
                                 </div>
                             </div>
                             {!isCreate &&
                                 <Fragment>
                                     <div className="row inner-rows">
                                         <div className="col-4 payment-info-text text-start align-middle">Address</div>
                                         <div className="col-8 payment-info-text text-start align-middle">
                                             <input type="text"
                                                    className="form-control custom-input"
                                                    maxLength={300}
                                                    value={address}
                                                    placeholder="(optional)"
                                                    onChange={(event) => {setAddress(event.target.value)}}
                                            />
                                         </div>
                                     </div>
                                     <div className="row inner-rows">
                                         <div className="col-4 payment-info-text text-start align-middle">Date of Birth</div>
                                         <div className="col-8 payment-info-text text-start align-middle">
                                             <input type="date"
                                                    className="form-control custom-input"
                                                    value={dateOfBirth}
                                                    onChange={(event) => {setDateOfBirth(event.target.value)}}
                                             />
                                         </div>
                                     </div>
                                     <div className="row inner-rows">
                                         <div className="col-4 payment-info-text text-start align-middle">City of birth</div>
                                         <div className="col-8 payment-info-text text-start align-middle">
                                             <input type="text"
                                                    className="form-control custom-input"
                                                    maxLength={100}
                                                    value={cityOfBirth}
                                                    placeholder="(optional)"
                                                    onChange={(event) => {setCityOfBirth(event.target.value)}}
                                             />
                                         </div>
                                     </div>
                                     <div className="row inner-rows">
                                         <div className="col-4 payment-info-text text-start align-middle">Country of birth</div>
                                         <div className="col-8 payment-info-text text-start align-middle">
                                             <input type="text"
                                                    className="form-control custom-input"
                                                    maxLength={100}
                                                    value={countryOfBirth}
                                                    placeholder="(optional)"
                                                    onChange={(event) => {setCountryOfBirth(event.target.value)}}
                                             />
                                            </div>
                                     </div>
                                     <div className="row inner-rows">
                                         <div className="col-4 payment-info-text text-start align-middle">Gender</div>
                                         <div className="col-8 payment-info-text text-start align-middle">
                                             <div className="form-check form-check-inline" onClick={() => handleUserSexChoice("F")}>
                                                 <input type="radio"
                                                        className="form-check-input"
                                                        name="rdo"
                                                        checked={female}
                                                        value={female}
                                                        onChange={() => handleUserSexChoice("F")}
                                                 />
                                                 <label className="form-check-label">Female</label>
                                             </div>
                                             <div className="form-check form-check-inline" onClick={() => handleUserSexChoice("M")}>
                                                 <input type="radio"
                                                        className="form-check-input"
                                                        name="rdo"
                                                        checked={male}
                                                        value={male}
                                                        onChange={() => handleUserSexChoice("M")}
                                                 />
                                                 <label className="form-check-label">Male</label>
                                             </div>
                                             <div className="form-check form-check-inline" onClick={() => handleUserSexChoice("U")}>
                                                 <input type="radio"
                                                        className="form-check-input"
                                                        name="rdo"
                                                        checked={unspecified}
                                                        value={unspecified}
                                                        onChange={() => handleUserSexChoice("U")}
                                                 />
                                                 <label className="form-check-label">Other</label>
                                             </div>
                                         </div>
                                     </div>
                                 </Fragment>
                             }

                             {isCreate &&
                                <div className="row inner-rows">
                                    <div className="col-4 payment-info-text text-start align-middle">Send Registration</div>
                                    <div className="col-8 payment-info-text text-start align-middle">
                                        <div className="form-check form-switch">
                                            <input className="form-check-input"
                                                   type="checkbox"
                                                   checked={sendRegistrationLink}
                                                   value={sendRegistrationLink}
                                                   onChange={(e) => setSendRegistrationLink(e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                             }
                         </div>

                        <div className="text-end error-display">
                            {errorMessage}
                        </div>

                    </Modal.Body>
                <Modal.Footer bsPrefix="custom-modal-footer">
                    <Button type="button"
                            className="btn-sm close-button"
                            onClick={handleCloseModal}
                    >
                        Close
                    </Button>
                    <Button
                        className="btn btn-sm save-button"
                        onClick={ () => handleSave()}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default UserProfileModalComponent;
