import {Fragment, useEffect, useState} from "react";
import SecondaryNavBar from "../secondaryNavBar";
import ApiClient from "../../utils/apiConfiguration";
import DataParser from "../../utils/dataParser";
import {ContribSelectContext, defaultSelectConfiguration} from "./context";
import {v4 as uuidv4} from "uuid";
import ReactTooltip from "react-tooltip";
import {
    arrayDifference,
    buildDummyPaymentStatus, formatValue,
    getIdsFromArray,
    getIncludedType,
    getObjectById
} from "../../utils/utils";
import AnimatedNumber from "animated-number-react";


const apiClient = new ApiClient();

const ListHeaderComponent = ({}) => {
    return (
        <Fragment>
            <div className="row underline" />

            <div className="table-responsive admin-payments-table-header">
                <table className="table">
                    <thead>
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Balance</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </Fragment>
    );
};

const RowUserPaymentStatusDisplay = ({ userContribStatus }) => {
    const firstName = userContribStatus.relationships.user.attributes.first_name;
    const lastName = userContribStatus.relationships.user.attributes.last_name;
    const email = userContribStatus.relationships.user.attributes.email;
    const [displayName, setDisplayName] = useState("");
    const [displayBalance, setDisplayBalance] = useState(0);

    useEffect(async () => {
        let nameToDisplay;
        if (firstName && lastName) {
            nameToDisplay = `${firstName} ${lastName}`;
        } else if (!firstName && lastName) {
            nameToDisplay = lastName;
        } else if (firstName && !lastName) {
            nameToDisplay = firstName;
        } else {
            nameToDisplay = email;
        }

        await setDisplayName(nameToDisplay);
        await setDisplayBalance(userContribStatus.attributes.current_value);
    }, []);

    return (
        <Fragment>
            <tr className="user-payment-status-row">
                <td className="align-middle user-name-display">{displayName}</td>
                <td className={"text-end " + (displayBalance >= 0 ? "no-payment-due" : "need-more-payment")}>
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
    const [usersStatusData, setUsersStatusData] = useState([]);
    const [usersParams, setUsersParams] = useState({});

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

    const fetchMembersContribStatus = async () => {
        const userData = await apiClient.get("users", usersParams);
        if (userData && userData.data && userData.data.length > 0) {
            const thereIsMoreUsers = userData.meta.pagination.page < userData.meta.pagination.pages;
            setHasMoreUsers(thereIsMoreUsers);
            const userIds = getIdsFromArray(userData.data);
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
                        ... await getIncludedType(usersSelectedContribData.included, "User")
                    );
                    usersIdsInStatus = usersIdsInStatus.concat(await getIdsFromArray(includedUsersInStatus));
                }
                usersWithoutInStatus = await arrayDifference(userIds, usersIdsInStatus);
                for (let userId of usersWithoutInStatus) {
                    const contribField = await getObjectById(contribData, selectConfig.selected.value);
                    const dummyUserPaymentStatus = buildDummyPaymentStatus(contribField);
                    dummyUserPaymentStatus.relationships.user = await getObjectById(userData.data, userId);
                    usersSelectedContribData.data.push(dummyUserPaymentStatus);
                    await usersSelectedContribData.data.sort((itemA, itemB) => {
                        const paymentNameA = itemA.relationships.user.attributes.first_name;
                        const paymentNameB = itemB.relationships.user.attributes.first_name;
                        return paymentNameA.localeCompare(paymentNameB) ;
                    });
                }
                await setUsersStatusData(usersSelectedContribData.data);
            }
        }
    };

    useEffect(async () => {
        await fetchContribFields();
    }, []);

    useEffect(async () => {
        await fetchMembersContribStatus();
    }, [selectConfig.selected.value]);

    const handleSearch = (event) => {
        setSearchValue(event.target.value);
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

    return (
        <ContribSelectContext.Provider value={selectConfig}>
            <Fragment>
                <SecondaryNavBar searchText={searchValue}
                                 handleSearch={handleSearch}
                                 handleSelect={handleSelect}
                                 TableHeaderComponent={ListHeaderComponent}
                />

                <div className="table-responsive admin-payment-status-container">
                    <table className="table">
                        <tbody>
                            {
                                usersStatusData.map((payment) => (
                                    <Fragment key={payment.id}>
                                        <RowUserPaymentStatusDisplay key={payment.id}
                                                                     userContribStatus={payment}
                                        />
                                    </Fragment>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </Fragment>
        </ContribSelectContext.Provider>
    );
};

export default BaseMembershipPayments;
