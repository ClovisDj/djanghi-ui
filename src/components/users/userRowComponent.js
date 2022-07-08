import {Fragment, useContext, useEffect, useState} from "react";
import {UserDataContext} from "../../app/contexts";
import {v4 as uuidv4} from "uuid";
import {isMobile} from "react-device-detect";
import ReactTooltip from "react-tooltip";
import {Button} from "react-bootstrap";

import UserProfileModalComponent, {AdminRolesModal} from "./modals";
import ConfirmResendRegistrationModal from "./confirmResendRegistration";
import {buildUserDisplayName} from "../../utils/utils";


const SingleUserComponent = ({ userData }) => {
    const userDataContext = useContext(UserDataContext);
    const editAdminTip = "Modify this admin roles";
    const addAdminTip = "Make this user admin";
    const resendTip = "Resend user registration link";
    const registeredTip = "This user is already registered";
    const registeredTipId = uuidv4();
    const editAdminTipID = uuidv4();
    const addAdminTipID = uuidv4();
    const isRegisteredTipId = uuidv4();
    const [authUser, setAuthUser] = useState();
    const [displayName, setDisplayName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [isRegistered, setIsRegistered] = useState(true);
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [userIsFullAdmin, setUserIsFullAdmin] = useState(false);
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [showResendConfirm, setShowResendConfirm] = useState(false);

    const handleUserClick = () => {
        setOpenProfileModal(true);
    };

    const handleResendRegistration = async (event) => {
        event.stopPropagation();
        event.preventDefault();
        setShowResendConfirm(true);
    };

    const handleAdminButtonClick = async (event) => {
        event.stopPropagation();
        setShowAdminModal(true);
    };

    const handleDisabledResendRegistration = async (event) => {
        // This is just to prevent the user profile modal to open when this disabled button is clicked
        event.stopPropagation();
    };

    useEffect(async () => {
        if (userDataContext.user) {
            setAuthUser(userDataContext.user.data);
        }
    }, [userDataContext.user]);


    useEffect(async () => {
        if (userData && userData.attributes) {
            const attributes = userData.attributes;
            const firstName = attributes.first_name;
            const lastName = attributes.last_name;
            const email = attributes.email;
            setIsRegistered(attributes.is_registered);
            setUserEmail(email);
            setDisplayName(buildUserDisplayName(firstName, lastName, email));
            setUserIsAdmin(attributes.is_admin);
            setUserIsFullAdmin(attributes.is_full_admin);
        }
    }, []);

    return (
        <Fragment>
            <tr className="user-status-row d-flex" onClick={handleUserClick} >
                {authUser && authUser.attributes && authUser.attributes.is_full_admin &&
                    <Fragment>
                        <td className={"user-name-display col-4 " + (isMobile ? "overflow-scroll" : "")} scope="col">
                            {displayName}
                        </td>
                        <td className="admin-status text-center col-4" scope="col">
                            {userIsFullAdmin &&
                                <div className="resend-registration">
                                    <ReactTooltip id={editAdminTipID} className="custom-tooltip" effect="solid" place="right" />
                                    <Button variant="primary"
                                            onClick={handleAdminButtonClick}
                                            data-tip={editAdminTip}
                                            data-for={editAdminTipID}>
                                        Full Admin
                                    </Button>
                                </div>
                            }
                            {!userIsFullAdmin && userIsAdmin &&
                                <div className="resend-registration">
                                    <ReactTooltip id={editAdminTipID} className="custom-tooltip" effect="solid" place="right" />
                                    <Button variant="secondary"
                                            onClick={handleAdminButtonClick}
                                            data-tip={editAdminTip}
                                            data-for={editAdminTipID}>
                                        &ensp; Manager &ensp;
                                    </Button>
                                </div>
                            }
                            {!userIsAdmin &&
                                <div className="resend-registration">
                                    <ReactTooltip id={addAdminTipID} className="custom-tooltip" effect="solid" place="right" />
                                    <Button variant="light"
                                            onClick={handleAdminButtonClick}
                                            data-tip={addAdminTip}
                                            data-for={addAdminTipID}>
                                        Make Admin
                                    </Button>
                                </div>
                            }
                        </td>
                        <td className="registration-status text-end col-4" scope="col">
                            {!isRegistered &&
                                <div className="resend-registration">
                                    <ReactTooltip id={registeredTipId} className="custom-tooltip" effect="solid" place="left" />
                                    <Button variant="warning"
                                            onClick={handleResendRegistration}
                                            data-tip={resendTip}
                                            data-for={registeredTipId}>
                                        &nbsp;&ensp; Resend &ensp;&nbsp;
                                    </Button>
                                </div>
                            }
                            {isRegistered &&
                                <div className="resend-registration custom-registered-color">
                                    <ReactTooltip id={isRegisteredTipId} className="custom-tooltip" effect="solid" place="left" />
                                    <Button variant="success"
                                            onClick={handleDisabledResendRegistration}
                                            data-tip={registeredTip}
                                            data-for={isRegisteredTipId}>
                                        Registered
                                    </Button>
                                </div>
                            }
                        </td>
                    </Fragment>
                }

                {authUser && authUser.attributes && !authUser.attributes.is_full_admin &&
                    <Fragment>
                        <td className={"user-name-display col-6 " + (isMobile ? "overflow-scroll" : "")} scope="col">
                            {displayName}
                        </td>
                        <td className="registration-status text-end col-6" scope="col">
                            {!isRegistered &&
                                <div className="resend-registration">
                                    <ReactTooltip id={registeredTipId} className="custom-tooltip" effect="solid" place="left" />
                                    <Button variant="warning"
                                            onClick={handleResendRegistration}
                                            data-tip={resendTip}
                                            data-for={registeredTipId}>
                                        &nbsp;&ensp; Resend &ensp;&nbsp;
                                    </Button>
                                </div>
                            }
                            {isRegistered &&
                                <div className="resend-registration custom-registered-color">
                                    <ReactTooltip id={isRegisteredTipId} className="custom-tooltip" effect="solid" place="left" />
                                    <Button variant="success"
                                            onClick={handleDisabledResendRegistration}
                                            data-tip={registeredTip}
                                            data-for={isRegisteredTipId}>
                                        Registered
                                    </Button>
                                </div>
                            }
                        </td>
                    </Fragment>
                }
            </tr>
            <UserProfileModalComponent userData={userData}
                                       setShowModal={setOpenProfileModal}
                                       showModal={openProfileModal}
            />
            <AdminRolesModal userData={userData}
                             displayName={displayName}
                             showModal={showAdminModal}
                             setShowModal={setShowAdminModal}
                             isAddRole={userIsAdmin}
            />
            <ConfirmResendRegistrationModal userDisplayName={displayName}
                                            userEmail={userEmail}
                                            setShowResendConfirm={setShowResendConfirm}
                                            showResendConfirm={showResendConfirm}
            />
        </Fragment>
    );
};

export default SingleUserComponent;
