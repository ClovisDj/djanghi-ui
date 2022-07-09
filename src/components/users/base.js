import {Fragment, useContext, useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";
import InfiniteScroll from "react-infinite-scroll-component";

import FloatingButton from "../sharedComponents/floatingButton/floatingButton";
import SecondaryNavBar from "../sharedComponents/secondaryNavBar";
import ApiClient from "../../utils/apiConfiguration";
import DataParser from "../../utils/dataParser";
import PageLoader from "../sharedComponents/spinner/pageLoader";
import UserProfileModalComponent from "./modals";
import {RefreshUsersContext, UserProfileContext} from "./contexts";
import {UserDataContext} from "../../app/contexts";
import SingleUserComponent from "./userRowComponent";


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


const BaseUsers = ({ }) => {
    const [searchValue, setSearchValue] = useState("");
    const [userSearchParams, setUserSearchParams] = useState({search: ""});
    const [currentPage, setCurrentPage] = useState(1);
    const [userData, setUserData] = useState([]);
    const [userProfileData, setUserProfileData] = useState({});
    const [isNewUser, setIsNewUser] = useState(true);
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
        setIsNewUser(true);
        setUserProfileData(null);
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

    const userProfileDataContext = {
        showRegistrationModal: showRegistrationModal,
        setShowRegistrationModal: setShowRegistrationModal,
        userProfileData: userProfileData,
        setUserProfileData: setUserProfileData,
        isNewUser: isNewUser,
        setIsNewUser: setIsNewUser,
    };

    return (
        <RefreshUsersContext.Provider value={refreshDataContext}>
            <UserProfileContext.Provider value={userProfileDataContext}>
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

                    <UserProfileModalComponent userData={userProfileDataContext.userProfileData}
                                               showModal={showRegistrationModal}
                                               setShowModal={setShowRegistrationModal}
                                               isCreate={isNewUser}
                    />

                    <FloatingButton buttonType={"plus"}
                                    handleClick={handleOpenRegistrationModal}
                                    shouldDisplay={true}
                                    tooltipText={"Add Members"}
                    />

                </Fragment>
            </UserProfileContext.Provider>

        </RefreshUsersContext.Provider>
    );
};

export default BaseUsers;
