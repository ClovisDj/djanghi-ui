import {Fragment, useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";

import SecondaryNavBar from "../sharedComponents/secondaryNavBar";
import ApiClient from "../../utils/apiConfiguration";
import DataParser from "../../utils/dataParser";
import {ContribSelectContext, defaultSelectConfiguration, ShouldRefreshPaymentsContext} from "./context";
import {
    arrayDifference,
    buildDummyPaymentStatus,
    buildUserDisplayName,
    formatValue,
    getIdsFromArray,
    getIncludedType,
    getObjectById
} from "../../utils/utils";

import AddPaymentsModal from "./modals";
import MoreTransactionsModal from "../dashboard/transactionsModal";
import FloatingButton from "../sharedComponents/floatingButton/floatingButton";
import PageLoader from "../sharedComponents/spinner/pageLoader";
import ReactTooltip from "react-tooltip";


const apiClient = new ApiClient();

const ListHeaderComponent = ({}) => {
    return (
        <Fragment>
            <div className="row underline" />

            <div className="table-responsive admin-payments-table-header">
                <table className="table">
                    <thead>
                        <tr>
                          <th className="text-start col-6" scope="col">Name</th>
                          <th className="text-end col-3" scope="col">Unpaid</th>
                          <th className="text-end col-3" scope="col">Paid</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </Fragment>
    );
};

const RowUserPaymentStatusDisplay = ({ userContribStatus, handleClick }) => {
    const firstName = userContribStatus.relationships.user.attributes.first_name;
    const lastName = userContribStatus.relationships.user.attributes.last_name;
    const email = userContribStatus.relationships.user.attributes.email;
    const [displayName, setDisplayName] = useState("");
    const [displayBalance, setDisplayBalance] = useState(0);
    const [unpaidAmount, setUnpaidAmount] = useState(0);
    const [balanceClassDisplay, setBalanceClassDisplay] = useState("no-payment-due");
    const [tooltipMessage, setTooltipMessage] = useState("");

    useEffect(async () => {
        const nameToDisplay = buildUserDisplayName(firstName, lastName, email);
        setDisplayName(nameToDisplay);
        const currentValue = userContribStatus.attributes.current_value;
        setDisplayBalance(currentValue);
        if (userContribStatus.relationships.membership_payment_type) {
            const requiredAmount = userContribStatus.relationships.membership_payment_type.attributes.required_amount;

            if (currentValue < 0) {
                setBalanceClassDisplay("need-more-payment");
            }

            if (currentValue > 0 && currentValue > requiredAmount) {
                setBalanceClassDisplay("overpaid-display-payment");
            }

            if (requiredAmount > 0) {
                if (requiredAmount > currentValue) {
                    setUnpaidAmount(requiredAmount - currentValue);
                    setBalanceClassDisplay("need-more-payment");
                } else if (currentValue > requiredAmount) {
                    setUnpaidAmount(currentValue - requiredAmount);
                    setBalanceClassDisplay("overpaid-display-payment");
                    setTooltipMessage(`This member is overpaying $ ${currentValue - requiredAmount}`);
                } else {
                    setBalanceClassDisplay("no-payment-due");
                }
            } else {
                if (currentValue < 0) {
                    setUnpaidAmount(-1 * currentValue);
                } else if (currentValue > 0) {
                    setUnpaidAmount(currentValue);
                    setBalanceClassDisplay("overpaid-display-payment");
                    setTooltipMessage(`This member is overpaying $ ${currentValue}`);
                } else {
                   setUnpaidAmount(currentValue);
                   setBalanceClassDisplay("no-payment-due");
                }
            }
        }
    }, []);

    return (
        <Fragment>
            <tr className="user-payment-status-row d-flex" onClick={handleClick} data-tip={tooltipMessage}>
                <td className="user-name-display overflow-scroll col-6" scope="col">
                   {displayName}
                </td>
                <td className={"text-end overflow-scroll col-3 " + balanceClassDisplay} scope="col">
                    {formatValue(unpaidAmount)}
                </td>
                <td className={"text-end overflow-scroll col-3 " + balanceClassDisplay} scope="col">
                    {tooltipMessage &&
                        <ReactTooltip className="custom-tooltip" />
                    }
                    {formatValue(displayBalance)}
                </td>
            </tr>
        </Fragment>
    );
};

const BaseMembershipPayments = () => {
    const [searchValue, setSearchValue] = useState("");
    const [selectConfig, setSelectConfig] = useState(defaultSelectConfiguration);
    const [contribOptions, setContribOptions] = useState([]);
    const [contribData, setContribData] = useState([]);
    const [adminContribStatusParams, setAdminContribStatusParams] = useState({});
    const [hasMoreUsers, setHasMoreUsers] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [usersStatusData, setUsersStatusData] = useState([]);
    const [usersParams, setUsersParams] = useState({});
    const [clickedUserPaymentStatus, setClickedUserPaymentStatus] = useState({relationships: {user: {}}});
    const [clickedUserDisplayName, setClickedUserDisplayName] = useState("");
    const [showSelectedUserPayments, setShowSelectedUserPayments] = useState(false);
    const [shouldRefreshData, setShouldRefreshData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userIdsArray, setUserIdsArray] = useState([]);
    // The below param is to force re-render the table component once a payment added
    const [tableKey, setTableKey] = useState(uuidv4());

    const fetchContribFields = async () => {
        const data = await apiClient.get("contribution_fields");
        if (data) {
            const dataParser = await new DataParser(data);
            let contribArray = [];
            for (let contrib of dataParser.data.data) {
                contribArray.push({
                    value: contrib.id,
                    label: contrib.attributes.name
                });
            }

            setContribData(dataParser.data.data);
            setContribOptions(contribArray);

            const config = {
                contribOptions: contribArray,
                selected: contribArray.length > 0 ? contribArray[0] : {label: "", value: ""},
            };

            await setAdminContribStatusParams({
               ...adminContribStatusParams,
               contribution_id: config.selected.value,
            });

            await setSelectConfig(config);

        }
    };

    const fetchMembersContribStatus = async (searchParams = {}) => {
        setIsLoading(true);

        const requestParams = {
            ...usersParams,
            ...searchParams
        };
        const userData = await apiClient.get("users", requestParams);
        if (userData && userData.data && userData.data.length > 0) {
            const thereIsMoreUsers = userData.meta.pagination.page < userData.meta.pagination.pages;
            setHasMoreUsers(thereIsMoreUsers);
            const userIds = await getIdsFromArray(userData.data);
            setUserIdsArray(userIds);
            const queryParams = {
                ...adminContribStatusParams,
                user_ids: userIds.join(',')
            };

            let includedUsersInStatus = [];
            let usersIdsInStatus = [];
            let usersWithoutInStatus = [];
            const contribStatusData = await apiClient.get("membership_payments_status", queryParams);
            if (contribStatusData.data) {
                const dataParser = await new DataParser(contribStatusData);
                let usersSelectedContribData = dataParser.data;
                if (usersSelectedContribData.hasOwnProperty("included")) {
                    includedUsersInStatus = includedUsersInStatus.concat(
                        ... getIncludedType(usersSelectedContribData.included, "User")
                    );
                    usersIdsInStatus = usersIdsInStatus.concat(getIdsFromArray(includedUsersInStatus));
                }
                usersWithoutInStatus = await arrayDifference(userIds, usersIdsInStatus);
                for (let userId of usersWithoutInStatus) {
                    const contribField = getObjectById(contribData, selectConfig.selected.value);
                    const dummyUserPaymentStatus = buildDummyPaymentStatus(contribField);
                    dummyUserPaymentStatus.relationships.user = getObjectById(userData.data, userId);
                    usersSelectedContribData.data.push(dummyUserPaymentStatus);
                    await usersSelectedContribData.data.sort((itemA, itemB) => {
                        const paymentNameA = itemA.relationships.user.attributes.first_name;
                        const paymentNameB = itemB.relationships.user.attributes.first_name;
                        return paymentNameA.localeCompare(paymentNameB) ;
                    });
                }
                setUsersStatusData(usersSelectedContribData.data);
            }
        } else {
            setUsersStatusData([]);
        }

        setIsLoading(false);
        setTableKey(uuidv4());
    };

    useEffect(async () => {
        await fetchContribFields();
    }, []);

    useEffect(async () => {
        await fetchMembersContribStatus();
    }, [selectConfig.selected.value]);

    useEffect(async () => {
        if(shouldRefreshData) {
            await fetchMembersContribStatus();
            setShouldRefreshData(false);
        }

    }, [shouldRefreshData]);

    const handleSearch = async (event) => {
        setSearchValue(event.target.value);
        setUsersParams({
            ...usersParams,
            search: event.target.value
        });
        await fetchMembersContribStatus({search: event.target.value});
    };

    const handleSelect = (selection) => {
        let localSelectOptions = {
            ...selectConfig,
            contribOptions: contribOptions,
            selected: selection
        };

        setSelectConfig(localSelectOptions);
        setAdminContribStatusParams({
               ...adminContribStatusParams,
               contribution_id: localSelectOptions.selected.value,
        });
    };

    const handleRowClick = (paymentStatus) => {
        setClickedUserPaymentStatus(paymentStatus);
        const userAttributes = paymentStatus.relationships.user.attributes;
        const userDisplayName = buildUserDisplayName(
            userAttributes.first_name,
            userAttributes.last_name,
            userAttributes.email
        );
        setClickedUserDisplayName(userDisplayName);
        setShowSelectedUserPayments(true);
    };

    const handleOpenPaymentModal = () => {
        setShowPaymentModal(true);
    };

    return (
        <ContribSelectContext.Provider value={selectConfig}>
            <ShouldRefreshPaymentsContext.Provider
                value={{shouldRefreshData: shouldRefreshData, setShouldRefreshData: setShouldRefreshData}}>
                <Fragment>
                    <SecondaryNavBar searchText={searchValue}
                                     handleSearch={handleSearch}
                                     handleSelect={handleSelect}
                                     TableHeaderComponent={ListHeaderComponent}
                    />

                    {isLoading &&
                        <PageLoader />
                    }

                    <div className="table-responsive-md admin-payment-status-container">
                        <table key={tableKey} className="table">
                            <tbody>
                                {!isLoading && userIdsArray.length === usersStatusData.length && usersStatusData.map((payment) => (
                                        <Fragment key={payment.id}>
                                            <RowUserPaymentStatusDisplay userContribStatus={payment}
                                                                         handleClick={() => handleRowClick(payment)}
                                            />
                                        </Fragment>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <MoreTransactionsModal paymentName={clickedUserDisplayName ? clickedUserDisplayName : ""}
                                           userId={clickedUserPaymentStatus.relationships.user.id}
                                           contributionId={selectConfig.selected.value}
                                           showMorePayments={showSelectedUserPayments}
                                           setShowMorePayments={setShowSelectedUserPayments}
                    />

                    <AddPaymentsModal showPaymentModal={showPaymentModal}
                                      setShowPaymentModal={setShowPaymentModal}
                                      contribInfo={selectConfig.selected}
                    />

                    <FloatingButton buttonType={"plus"}
                                handleClick={handleOpenPaymentModal}
                                shouldDisplay={true}
                                tooltipText={"Add Payments"}
                    />
                    </Fragment>
            </ShouldRefreshPaymentsContext.Provider>
        </ContribSelectContext.Provider>
    );
};

export default BaseMembershipPayments;
