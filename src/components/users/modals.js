import {Button, Modal} from "react-bootstrap";
import {Fragment, useContext, useEffect, useState} from "react";
import ApiClient from "../../utils/apiConfiguration";
import {RefreshUsersContext} from "./contexts";

const apiClient = new ApiClient();

const UserProfileModalComponent = ({ userData, showModal, setShowModal, isCreate= false }) => {
    const refreshDataContext = useContext(RefreshUsersContext);

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
    }, []);

    const handleCloseModal = async () => {
        await setShowModal(false);
        await clearModalContent();

    };

    const handleUserSexChoice = (choice) => {
        Object.keys(sexChoicesMap).forEach((sexType) => sexChoicesMap[sexType](choice));
    };

    const clearModalContent = async () => {

    };

    const buildRequestPayload = async () => {
        let payload = {
            first_name: firstName ? firstName : null,
            last_name: lastName ? lastName : null,
            address: address ? address : null,
            date_of_birth: dateOfBirth ? dateOfBirth : null,
            city_of_birth: cityOfBirth ? cityOfBirth : null,
            country_of_birth: countryOfBirth ? countryOfBirth : null,
        };

        if (isCreate) {
            payload.email = email;
        }

        [[female, "F"], [male, "M"], [unspecified, "U"]].forEach((sexOption) => {
            if (sexOption[0]) {
                payload.sex = sexOption[1];
            }
            return sexOption;
        });

        return payload;
    };

    const handleSave = async () => {
        const requestMethod = isCreate ? "post" : "patch";
        const requestEndPoint = isCreate ? "registrations" : `users/${userData.id}`;
        const requestData = await buildRequestPayload();
        const userResponseData = await apiClient[requestMethod](requestEndPoint, requestData);
        if (userResponseData.data) {
            refreshDataContext.setShouldRefreshData(true);
            setShowModal(false);
        }
    };

    return (
        <Fragment>
            <Modal contentClassName="add-payments-modal-content"
                   show={showModal}
                   backdrop="static"
                   onHide={handleCloseModal}
                   scrollable={true}
            >
                <Modal.Header bsPrefix={"custom-modal-header"} closeButton>
                    <Modal.Title id="user-payments-list">
                        <div className="card-title">User Profile</div>
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
                                            placeholder="(optional)"
                                            disabled={!isCreate}
                                            onChange={(event) => {setFirstName(event.target.value)}}
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
                                            onChange={(event) => {setFirstName(event.target.value)}}
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
                                            onChange={(event) => {setLastName(event.target.value)}}
                                     />
                                 </div>
                             </div>
                             <div className="row inner-rows">
                                 <div className="col-4 payment-info-text text-start align-middle">
                                     Address
                                 </div>
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
                                 <div className="col-4 payment-info-text text-start align-middle">
                                     Date of Birth
                                 </div>
                                 <div className="col-8 payment-info-text text-start align-middle">
                                     <input type="date"
                                            className="form-control custom-input"
                                            value={dateOfBirth}
                                            onChange={(event) => {setDateOfBirth(event.target.value)}}
                                     />
                                 </div>
                             </div>
                             <div className="row inner-rows">
                                 <div className="col-4 payment-info-text text-start align-middle">
                                     City of birth
                                 </div>
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
                                 <div className="col-4 payment-info-text text-start align-middle">
                                     Country of birth
                                 </div>
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
                                 <div className="col-4 payment-info-text text-start align-middle">
                                     Gender
                                 </div>
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
                        onClick={async () => await handleSave()}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default UserProfileModalComponent;
