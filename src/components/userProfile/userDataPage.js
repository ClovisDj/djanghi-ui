import {Fragment, useEffect, useMemo, useState} from "react";
import countryList from "react-select-country-list";
import {Form} from "react-bootstrap";
import PhoneInput from "react-phone-number-input";
import Select from "react-select";

import {errorToast, successToast} from "../sharedComponents/toaster/toastify";
import ApiClient from "../../utils/apiConfiguration";
import TokenManager from "../../utils/authToken";


const apiClient = new ApiClient();
const tokenManager = new TokenManager();

const UserDataComponent = ({ userProfileData, setUserProfileData }) => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [female, setFemale] = useState(false);
    const [male, setMale] = useState(false);
    const [unspecified, setUnspecified] = useState(false);
    const defaultCountry = {label: "United States", value: "US"};
    const [country, setCountry] = useState(defaultCountry);

    const countryOptions = useMemo(() => countryList().getData(), []);

    const sexChoicesMap = {
        F: (choice) => setFemale(choice === "F"),
        M: (choice) => setMale(choice === "M"),
        U: (choice) => setUnspecified(choice === "U"),
    };

    const handleUserSexChoice = (choice) => {
        Object.keys(sexChoicesMap).forEach((sexType) => sexChoicesMap[sexType](choice));
    };

    const handleFirstNameChange = (event) => {
        setUserProfileData({
            ...userProfileData,
            first_name: event.target.value
        });
    };

    const handleLastNameChange = (event) => {
        setUserProfileData({
            ...userProfileData,
            last_name: event.target.value
        });
    };

    const handleAddressChange = (event) => {
        setUserProfileData({
            ...userProfileData,
            address: event.target.value
        });
    };

    const handleDateOfBirthChange = (event) => {
        setUserProfileData({
            ...userProfileData,
            date_of_birth: event.target.value
        });
    };

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event);
        setUserProfileData({
            ...userProfileData,
            phone_number: event
        });
    };

    const handleCityChange = (event) => {
        setUserProfileData({
            ...userProfileData,
            city: event.target.value
        });
    };

    const handleZipCodeChange = (event) => {
        setUserProfileData({
            ...userProfileData,
            zip_code: event.target.value
        });
    };

    const handleStateChange = (event) => {
        setUserProfileData({
            ...userProfileData,
            state: event.target.value
        });
    };

    const handleCountryChange = (value) => {
        setCountry(value);
    };

    useEffect(() => {
        if (userProfileData.country) {
            const localCountry = countryOptions.filter(
                item => (
                    userProfileData.country === item.value ||
                    userProfileData.country.toLowerCase() === item.label.toLowerCase()
                )
            );
            setCountry(localCountry.length > 0 ? localCountry[0] : defaultCountry);
        }

        if (userProfileData && userProfileData.sex) {
            setFemale(userProfileData.sex === "F");
            setMale(userProfileData.sex === "M");
            setUnspecified(userProfileData.sex === "U");
        }

        if (userProfileData && userProfileData.phone_number) {
            setPhoneNumber(userProfileData.phone_number);
        }
    }, [userProfileData]);

    const constructUserProfileObject = () => {
        let localUser = { ...userProfileData };
        [[female, "F"], [male, "M"], [unspecified, "U"]].forEach((sexOption) => {
            if (sexOption[0]) {
                localUser.sex = sexOption[1];
            }
            return sexOption;
        });

        if (country.value) {
            localUser.country = country.value;
        }
        return localUser;

    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = await apiClient.patch(`users/${tokenManager.getUserId()}`, constructUserProfileObject());
        if (!data.data) {
            errorToast();
            console.warn(`An unexpected error occurred ${data}`);
        } else {
            successToast("Successfully Saved !!!");
        }

    };

    return (
        <Fragment>
            <Form className="row g-3 needs-validation spacer" onSubmit={handleSubmit}>
                <div className="container">
                    <div className="row below-row-padding">
                         <div className="col-4 title-padding">
                             <span className="payment-info-text text-start">First Name</span>
                         </div>
                         <div className="col-8 payment-info-text text-start">
                             <input type="text"
                                    className="form-control custom-input"
                                    value={userProfileData.first_name ? userProfileData.first_name : ""}
                                    maxLength={120}
                                    onChange={handleFirstNameChange}
                                    required={true}
                             />
                         </div>
                    </div>
                    <div className="row underline" />
                    <div className="row profile-inner-rows below-row-padding">
                         <div className="col-4 title-padding">
                             <span className="payment-info-text text-start">Last Name</span>
                         </div>
                         <div className="col-8 payment-info-text text-start align-middle">
                             <input type="text"
                                    className="form-control custom-input"
                                    maxLength={120}
                                    value={userProfileData.last_name ? userProfileData.last_name : ""}
                                    onChange={handleLastNameChange}
                                    required={true}
                             />
                         </div>
                    </div>
                    <div className="row underline" />
                    <div className="row profile-inner-rows below-row-padding">
                        <div className="col-4 title-padding">
                            <span className="payment-info-text text-start">Date of Birth</span>
                        </div>
                        <div className="col-8 payment-info-text text-start align-middle">
                            <input type="date"
                                   className="form-control custom-input"
                                   value={userProfileData.date_of_birth ? userProfileData.date_of_birth : ""}
                                   onChange={handleDateOfBirthChange}
                            />
                        </div>
                     </div>
                    <div className="row underline" />
                    <div className="row profile-inner-rows below-row-padding">
                        <div className="col-4 title-padding">
                            <span className="payment-info-text text-start">Phone Number</span>
                        </div>
                        <div className="col-8 payment-info-text text-start align-middle">
                            <PhoneInput placeholder="(Optional)"
                                        value={phoneNumber}
                                        defaultCountry="US"
                                        onChange={handlePhoneNumberChange}
                            />
                        </div>
                     </div>
                    <div className="row underline" />
                    <div className="row profile-inner-rows below-row-padding">
                         <div className="col-4 title-padding">
                             <span className="payment-info-text text-start">Gender</span>
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
                    <div className="row underline" />
                    <div className="row profile-inner-rows below-row-padding">
                        <div className="col-4 title-padding">
                            <span className="payment-info-text text-start">Address</span>
                        </div>
                        <div className="col-8 payment-info-text text-start align-middle">
                            <input type="text"
                                   className="form-control custom-input"
                                   maxLength={300}
                                   value={userProfileData.address ? userProfileData.address : ""}
                                   placeholder="(optional)"
                                   onChange={handleAddressChange}
                            />
                        </div>
                    </div>
                    <div className="row underline" />
                    <div className="row profile-inner-rows below-row-padding">
                        <div className="col-4 title-padding">
                            <span className="payment-info-text text-start">City</span>
                        </div>
                        <div className="col-8 payment-info-text text-start align-middle">
                            <input type="text"
                                   className="form-control custom-input"
                                   maxLength={300}
                                   value={userProfileData.city ? userProfileData.city : ""}
                                   placeholder="(optional)"
                                   onChange={handleCityChange}
                            />
                        </div>
                    </div>
                    <div className="row underline" />
                    <div className="row profile-inner-rows below-row-padding">
                        <div className="col-4 title-padding">
                            <span className="payment-info-text text-start">Zip Code</span>
                        </div>
                        <div className="col-8 payment-info-text text-start align-middle">
                            <input type="text"
                                   className="form-control custom-input"
                                   maxLength={300}
                                   value={userProfileData.zip_code ? userProfileData.zip_code : ""}
                                   placeholder="(optional)"
                                   onChange={handleZipCodeChange}
                            />
                        </div>
                    </div>
                    <div className="row underline" />
                    <div className="row profile-inner-rows below-row-padding">
                        <div className="col-4 title-padding">
                            <span className="payment-info-text text-start">State / Province</span>
                        </div>
                        <div className="col-8 payment-info-text text-start align-middle">
                            <input type="text"
                                   className="form-control custom-input"
                                   maxLength={300}
                                   value={userProfileData.state ? userProfileData.state : ""}
                                   placeholder="(optional)"
                                   onChange={handleStateChange}
                            />
                        </div>
                    </div>
                    <div className="row underline" />
                    <div className="row profile-inner-rows below-row-padding">
                        <div className="col-4 title-padding">
                            <span className="payment-info-text text-start">Country</span>
                        </div>
                        <div className="col-8 payment-info-text text-start align-middle">
                            <Select options={countryOptions}
                                    value={country}
                                    onChange={handleCountryChange}
                            />
                        </div>
                    </div>
                    <div className="row underline" />
                    <div className="row below-row-padding profile-inner-rows">
                        <div className="col-4 offset-8">
                            <input className="btn btn-primary w-100" type="submit" value="Save" id="save-data" />
                        </div>
                    </div>
                </div>
            </Form>
        </Fragment>
    );
};

export default UserDataComponent;
