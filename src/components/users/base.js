import {Fragment, useContext, useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";

import FloatingButton from "../sharedComponents/floatingButton/floatingButton";
import SecondaryNavBar from "../sharedComponents/secondaryNavBar";
import ApiClient from "../../utils/apiConfiguration";
import DataParser from "../../utils/dataParser";
import {buildUserDisplayName} from "../../utils/utils";
import PageLoader from "../sharedComponents/spinner/pageLoader";
import {Button, Modal} from "react-bootstrap";
import TokenManager from "../../utils/authToken";
import UserProfileModalComponent, {AdminRolesModal} from "./modals";
import {RefreshUsersContext} from "./contexts";
import {isMobile} from "react-device-detect";
import ReactTooltip from "react-tooltip";
import InfiniteScroll from "react-infinite-scroll-component";
import {UserDataContext} from "../../app/contexts";


const apiClient = new ApiClient();

const ListUsersHeaderComponent = ({}) => {
    const [authUser, setAuthUser] = useState();
    const userDataContext = useContext(UserDataContext);

    useEffect(async () => {
        if (userDataContext.user) {
            setAuthUser(userDataContext.user.data);
        }
    }, [userDataContext.user]);

    return (
        <Fragment>
            <div className="row underline" />

            <div className="table-responsive admin-payments-table-header">
                <table className="table">
                    <thead>
                        <tr className="d-flex">
                            {authUser && authUser.attributes && authUser.attributes.is_full_admin &&
                                <Fragment>
                                    <th className="text-start col-4" scope="col">Name</th>
                                    <th className="text-center col-4" scope="col">Admin</th>
                                    <th className="text-end col-4" scope="col">Registration</th>
                                </Fragment>
                            }
                            {authUser && authUser.attributes && !authUser.attributes.is_full_admin &&
                                <Fragment>
                                    <th className="text-start col-6" scope="col">Name</th>
                                    <th className="text-end col-6" scope="col">Registration</th>
                                </Fragment>
                            }
                        </tr>
                    </thead>
                </table>
            </div>
        </Fragment>
    );
};


const ConfirmResendRegistrationModal = ({ userDisplayName, userEmail,  showResendConfirm, setShowResendConfirm }) => {

    const resendRegistration = async (event) => {
        event.stopPropagation();
        event.preventDefault();

        const resendLinkData = {
            email: userEmail,
            should_send_activation: true,
        };
        await apiClient.post("registrations", resendLinkData);
        setShowResendConfirm(false);
    };

    const handleDismiss = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setShowResendConfirm(false);

    };

    return (
        <Fragment>
            <Modal contentClassName="add-payments-modal-content"
                   show={showResendConfirm}
                   onHide={() => setShowResendConfirm(false)}
                   centered={true}
            >
                <Modal.Header bsPrefix={"custom-modal-header"} closeButton>
                    <Modal.Title id="user-payments-list">
                        <div className="card-title">
                            Resend Registration Invite
                        </div>
                      </Modal.Title>
                </Modal.Header>
                <Modal.Body bsPrefix={"payments-modal-body"}>
                    <div className="container payment-modal-content">
                        <div className="row">
                            <div className="col payment-info-text text-center align-middle">
                                Are you sure you want to resend the registration invite to <strong>{userDisplayName}</strong>?
                            </div>
                        </div>
                        <div className="row inner-rows">
                            <div className="col-6 payment-info-text text-center align-middle">
                                <Button type="button"
                                        className="btn-sm btn-secondary"
                                        onClick={resendRegistration}
                                >
                                        Yes
                                </Button>
                            </div>
                            <div className="col-6 payment-info-text text-center align-middle">
                                <Button type="button"
                                        className="btn-sm btn-secondary"
                                        onClick={handleDismiss}
                                >
                                        No
                                </Button>
                            </div>

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer bsPrefix="custom-modal-footer">
                        <Button type="button"
                                className="btn-sm close-button"
                                onClick={handleDismiss}
                        >
                            Close
                        </Button>

                    </Modal.Footer>
            </Modal>
        </Fragment>
    );
};


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

const BaseUsers = ({ }) => {
    const [searchValue, setSearchValue] = useState("");
    const [userSearchParams, setUserSearchParams] = useState({search: ""});
    const [currentPage, setCurrentPage] = useState(1);
    const [userData, setUserData] = useState([]);
    const [hasMoreUsers, setHasMoreUsers] = useState(false);
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const [shouldRefreshData, setShouldRefreshData] = useState(false);
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [shouldEmptyUsersList, setShouldEmptyUsersList] = useState(false);
    const [tableKey, setTableKey] = useState(uuidv4());

    const fetchUsers = async () => {
        let data = [...userData];
        let requestParams = {
            ...userSearchParams,
            page: currentPage,
        };

        setDataIsLoading(true);
        let localUserData = await apiClient.get(`users`, requestParams);
        if (localUserData.data) {
            localUserData = new DataParser(localUserData).data;

            if (!shouldEmptyUsersList) {
                setUserData(data.concat(localUserData.data));
            } else {
                setUserData(localUserData.data);
                setShouldEmptyUsersList(false);
            }


            const hasMorePages = localUserData.meta.pagination.page < localUserData.meta.pagination.pages;
            setCurrentPage(hasMorePages ? localUserData.meta.pagination.page + 1 : currentPage);
            setHasMoreUsers(hasMorePages);
        }
        setDataIsLoading(false);
        setTableKey(uuidv4());
        return data;
    };

    useEffect(async () => {
        await fetchUsers();
    }, [userSearchParams.search]);

     useEffect(async () => {
         if (shouldRefreshData) {
             await fetchUsers();
             setShouldRefreshData(false);
         }
    }, [shouldRefreshData]);

    const handleOpenRegistrationModal = () => {
        setShowRegistrationModal(true);
    };

    const resetPageParams = async () => {
        setShouldEmptyUsersList(true);
        setCurrentPage(1);
    };

    const handleSearch = async (event) => {
        setSearchValue(event.target.value);
        await resetPageParams();
        setUserSearchParams({
            ...userSearchParams,
            search: event.target.value,
        });
    };

    const refreshDataContext = {
        shouldRefreshData: shouldRefreshData,
        setShouldRefreshData: setShouldRefreshData,
        setShouldEmptyUsersList: setShouldEmptyUsersList,
        resetPageParams: resetPageParams,
    };

    return (
        <RefreshUsersContext.Provider value={refreshDataContext}>
            <Fragment>
                <SecondaryNavBar searchText={searchValue}
                                 handleSearch={handleSearch}
                                 TableHeaderComponent={ListUsersHeaderComponent}
                />

                {dataIsLoading && !shouldRefreshData && !userSearchParams.search.length > 0 &&
                    <PageLoader />
                }

                <InfiniteScroll dataLength={userData.length}
                                next={fetchUsers}
                                hasMore={hasMoreUsers}
                                pullDownToRefresh={true}
                                refreshFunction={fetchUsers}
                                scrollableTarget={"admin-payment-status-container"}
                                loader={<h4>...</h4>}
                >
                    <div className="table-responsive-md admin-payment-status-container">
                        <table key={tableKey} className="table">
                            <tbody>
                                {userData && userData.length > 0 && userData.map((user) => (
                                    <Fragment key={user.id}>
                                        <SingleUserComponent userData={user} />
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </InfiniteScroll>

                <UserProfileModalComponent showModal={showRegistrationModal}
                                           setShowModal={setShowRegistrationModal}
                                           isCreate={true}
                />

                <FloatingButton buttonType={"plus"}
                                handleClick={handleOpenRegistrationModal}
                                shouldDisplay={true}
                                tooltipText={"Add Members"}
                />

            </Fragment>
        </RefreshUsersContext.Provider>
    );
};

export default BaseUsers;
