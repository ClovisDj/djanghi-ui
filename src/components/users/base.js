import {Fragment, useEffect, useState} from "react";

import FloatingButton from "../sharedComponents/floatingButton/floatingButton";
import SecondaryNavBar from "../sharedComponents/secondaryNavBar";
import ApiClient from "../../utils/apiConfiguration";
import DataParser from "../../utils/dataParser";
import {buildUserDisplayName} from "../../utils/utils";
import PageLoader from "../sharedComponents/spinner/pageLoader";
import {v4 as uuidv4} from "uuid";
import {Button} from "react-bootstrap";
import TokenManager from "../../utils/authToken";
import UserProfileModalComponent, {AdminRolesModal} from "./modals";
import {RefreshUsersContext} from "./contexts";
import {isMobile} from "react-device-detect";
import ReactTooltip from "react-tooltip";
import InfiniteScroll from "react-infinite-scroll-component";


const apiClient = new ApiClient();
const tokenManager = new TokenManager();

const ListUsersHeaderComponent = ({}) => {
    const [authUser, setAuthUser] = useState();

    useEffect(async () => {
       await setAuthUser(tokenManager.getAuthUser().data);
    }, []);

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
                                    <th className="text-end overflow-scroll col-6" scope="col">Registration</th>
                                </Fragment>
                            }
                        </tr>
                    </thead>
                </table>
            </div>
        </Fragment>
    );
};


const SingleUserComponent = ({ userData }) => {
    const editAdminTip = "Modify this admin roles";
    const addAdminTip = "Make this user admin";
    const resendTip = "Resend user registration link";
    const registeredTip = "This user is already registered";
    const [authUser, setAuthUser] = useState();
    const [displayName, setDisplayName] = useState("");
    const [isRegistered, setIsRegistered] = useState(true);
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [userIsFullAdmin, setUserIsFullAdmin] = useState(false);
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);

    const handleUserClick = () => {
        setOpenProfileModal(true);
    };

    const handleResendRegistration = async (event) => {
        event.stopPropagation();
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
        await setAuthUser(tokenManager.getAuthUser().data);
        if (userData && userData.attributes) {
            const attributes = userData.attributes;
            const firstName = attributes.first_name;
            const lastName = attributes.last_name;
            const email = attributes.email;
            setIsRegistered(attributes.is_registered);
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
                                    <Button key={uuidv4()} variant="primary" onClick={handleAdminButtonClick} data-tip={editAdminTip}>
                                        <ReactTooltip key={uuidv4()} className="custom-tooltip" effect="solid" place="top" />
                                        Full Admin
                                    </Button>
                                </div>
                            }
                            {!userIsFullAdmin && userIsAdmin &&
                                <div className="resend-registration">
                                    <Button key={uuidv4()} variant="secondary" onClick={handleAdminButtonClick} data-tip={editAdminTip}>
                                        <ReactTooltip key={uuidv4()} className="custom-tooltip" effect="solid" place="top" />
                                        &ensp; Manager &ensp;
                                    </Button>
                                </div>
                            }
                            {!userIsAdmin &&
                                <div className="resend-registration">
                                    <Button key={uuidv4()} variant="light" onClick={handleAdminButtonClick} data-tip={addAdminTip}>
                                        <ReactTooltip key={uuidv4()} className="custom-tooltip" effect="solid" place="top" />
                                        Make Admin
                                    </Button>
                                </div>
                            }
                        </td>
                        <td className="registration-status text-end col-4" scope="col">
                            {!isRegistered &&
                                <div className="resend-registration">
                                    <Button key={uuidv4()} variant="warning" onClick={handleResendRegistration} data-tip={resendTip}>
                                        <ReactTooltip id={uuidv4()} className="custom-tooltip" effect="solid" place="top" />
                                        &nbsp;&ensp; Resend &ensp;&nbsp;
                                    </Button>
                                </div>
                            }
                            {isRegistered &&
                                <div className="resend-registration custom-registered-color">
                                    <Button key={uuidv4()} variant="success" onClick={handleDisabledResendRegistration} data-tip={registeredTip}>
                                        <ReactTooltip id={uuidv4()} className="custom-tooltip" effect="solid" place="top" />
                                        Registered
                                    </Button>
                                </div>
                            }
                        </td>
                    </Fragment>
                }

                {authUser && authUser.attributes && !authUser.attributes.is_full_admin &&
                    <Fragment>
                        <td className="user-name-display overflow-scroll col-6" scope="col">
                            {displayName}
                        </td>
                        <td className="registration-status text-end col-6" scope="col">
                            {!isRegistered &&
                                <div className="resend-registration">
                                    <Button variant="warning" onClick={handleResendRegistration}>
                                        &nbsp;&ensp; Resend &ensp;&nbsp;
                                    </Button>
                                </div>
                            }
                            {isRegistered &&
                                <div className="resend-registration custom-registered-color">
                                    <Button variant="success" onClick={handleDisabledResendRegistration}>
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
