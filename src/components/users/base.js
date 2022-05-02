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
import UserProfileModalComponent from "./modals";
import {RefreshUsersContext} from "./contexts";
import {isMobile} from "react-device-detect";


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
    const [authUser, setAuthUser] = useState();
    const [displayName, setDisplayName] = useState("");
    const [isRegistered, setIsRegistered] = useState(true);
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [userIsFullAdmin, setUserIsFullAdmin] = useState(false);
    const [openProfileModal, setOpenProfileModal] = useState(false);

    const handleUserClick = () => {
        setOpenProfileModal(true);
        console.log("clicked user!!!");
    };

    const handleResendRegistration = async (event) => {
        event.stopPropagation();
        console.log("clicked resend button!!!");
    };

    const handleAdminButtonClick = async (event) => {
        event.stopPropagation();
        console.log(userData);
        console.log("clicked admin button!!!");
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
                                    <Button variant="primary" onClick={handleAdminButtonClick}>Full Admin</Button>
                                </div>
                            }
                            {!userIsFullAdmin && userIsAdmin &&
                                <div className="resend-registration">
                                    <Button variant="secondary" onClick={handleAdminButtonClick}>
                                        &ensp; Manager &ensp;
                                    </Button>
                                </div>
                            }
                            {!userIsAdmin &&
                                <div className="resend-registration">
                                    <Button variant="light" onClick={handleAdminButtonClick}>Make Admin</Button>
                                </div>
                            }
                        </td>
                        <td className="registration-status text-end col-4" scope="col">
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
        </Fragment>
    );
};

const BaseUsers = ({ }) => {
    const [searchValue, setSearchValue] = useState("");
    const [userSearchParams, setUserSearchParams] = useState({});
    const [userData, setUserData] = useState([]);
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const [shouldRefreshData, setShouldRefreshData] = useState(false);
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [tableKey, setTableKey] = useState(uuidv4());


    const fetchUsers = async (params= {}) => {
        let data;
        const requestParams = {
            ...userSearchParams,
            ...params
        };
        setDataIsLoading(true);
        let localUserData = await apiClient.get(`users`, requestParams);
        if (localUserData.data) {
            data = new DataParser(localUserData);
            setUserData(data.data.data);
        }
        setDataIsLoading(false);
        return data;
    };

    useEffect(async () => {
        await fetchUsers();
    }, []);

     useEffect(async () => {
         if (shouldRefreshData) {
             await fetchUsers();
             setShouldRefreshData(false);
         }
    }, [shouldRefreshData]);

    const handleOpenRegistrationModal = () => {
        setShowRegistrationModal(true);
    };

    const handleSearch = async (event) => {
        setSearchValue(event.target.value);
        setUserSearchParams({
            ...userSearchParams,
            search: event.target.value
        });
        await fetchUsers({search: event.target.value});
    };

    return (
        <RefreshUsersContext.Provider
            value={{shouldRefreshData: shouldRefreshData, setShouldRefreshData: setShouldRefreshData}}>
            <Fragment>
                <SecondaryNavBar searchText={searchValue}
                                 handleSearch={handleSearch}
                                 TableHeaderComponent={ListUsersHeaderComponent}
                />

                {dataIsLoading &&
                    <PageLoader />
                }

                <div className="table-responsive-md admin-payment-status-container">
                    <table key={tableKey} className="table">
                        <tbody>
                            {!dataIsLoading && userData.map((user) => (
                                <Fragment key={user.id}>
                                    <SingleUserComponent userData={user} />
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

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
