import {Fragment, useContext, useEffect} from "react";
import {Form} from "react-bootstrap";

import {errorToast, successToast} from "../sharedComponents/toaster/toastify";
import ApiClient from "../../utils/apiConfiguration";
import TokenManager from "../../utils/authToken";
import {UserDataContext} from "../../app/contexts";

const apiClient = new ApiClient();
const tokenManager = new TokenManager();

const UserSettingsComponent = ({ userProfileData, setUserProfileData }) => {
    const userDataContext = useContext(UserDataContext);
    const handlePaymentsNotificationChange = (event) => {
        setUserProfileData({
            ...userProfileData,
            notify_on_payment: event.target.checked
        });
    };

    const handleAssociationNotificationChange = (event) => {
        setUserProfileData({
            ...userProfileData,
            receive_association_notification: event.target.checked
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = await apiClient.patch(`users/${tokenManager.getUserId()}`, { ...userProfileData });
        if (!data.data) {
            errorToast();
            console.warn(`An unexpected error occurred ${data}`);
        } else {
            successToast("Successfully Saved !!!");
            userDataContext.setUser(data);
        }
    };

    useEffect(() => {
        if (userDataContext.user) {
            tokenManager.storeAuthUser(userDataContext.user);
        }
    }, [userDataContext.user]);

    return (
        <Fragment>
            <Form className="row g-3 needs-validation spacer" onSubmit={handleSubmit}>
                <div className="container">
                    <div className="row below-row-padding">
                         <div className="col-6 title-padding">
                             <span className="payment-info-text text-start">Payments Notification</span>
                         </div>
                        <div className="col-6 payment-info-text form-check form-switch">
                            <input className="form-check-input"
                                   type="checkbox"
                                   checked={userProfileData.notify_on_payment}
                                   value={userProfileData.notify_on_payment}
                                   onChange={handlePaymentsNotificationChange}
                            />
                        </div>
                    </div>
                    <div className="row underline" />
                    <div className="row profile-inner-rows below-row-padding">
                         <div className="col-6 title-padding">
                             <span className="payment-info-text text-start">Receive Your Association Notifications</span>
                         </div>
                         <div className="col-6 payment-info-text form-check form-switch">
                            <input className="form-check-input"
                                   type="checkbox"
                                   checked={userProfileData.receive_association_notification}
                                   value={userProfileData.receive_association_notification}
                                   onChange={handleAssociationNotificationChange}
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

export default UserSettingsComponent;
