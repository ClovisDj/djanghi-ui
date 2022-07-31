import {Fragment, useEffect, useState} from "react";
import ReactTooltip from "react-tooltip";
import {v4 as uuidv4} from "uuid";

import ApiClient from "../../utils/apiConfiguration";
import TokenManager from "../../utils/authToken";
import CustomToaster from "../sharedComponents/toaster/toastify";
import UserSettingsComponent from "./userSettings";
import UserDataComponent from "./userDataPage";
import MembershipOptInComponent from "./membershipOptIn";
import {RefreshOptInDataContext} from "./contexts";

const apiClient = new ApiClient();
const tokenManager = new TokenManager();

const NavigationTabs = ({ setShowProfile, setShowSettings, setShowOptInSettings }) => {
    const optInTooltipId = uuidv4();
    const optInDataTip = "Once opted in and approved by your administrator, this payment info will appear on your dashboard.";

    const handleShowProfile = () => {
        setShowSettings(false);
        setShowOptInSettings(false);
        setShowProfile(true);
    };

    const handleShowSettings = () => {
        setShowProfile(false);
        setShowOptInSettings(false);
        setShowSettings(true);
    };

    const handleShowOptIn = () => {
        setShowProfile(false);
        setShowSettings(false);
        setShowOptInSettings(true);
    };

    return (
        <Fragment>
            <div className="row tabs-wrapper">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link custom-nav-tabs active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home"
                                type="button" role="tab" aria-controls="home" aria-selected="true"
                                onClick={() => handleShowProfile()}>
                            Profile
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link custom-nav-tabs" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile"
                                type="button" role="tab" aria-controls="profile" aria-selected="false"
                                onClick={() => handleShowSettings()}>
                            Settings
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <ReactTooltip id={optInTooltipId} className="custom-tooltip" effect="solid" place="top" />
                        <button className="nav-link custom-nav-tabs" id="payments-opt-in-tab" data-bs-toggle="tab" data-bs-target="#opt-in"
                                type="button" role="tab" aria-controls="optIn"
                                aria-selected="false" data-tip={optInDataTip}
                                      data-for={optInTooltipId}
                                onClick={() => handleShowOptIn()}>
                            Opt In
                        </button>
                    </li>
                </ul>
            </div>
        </Fragment>
    );
};


const BaseUserProfile = () => {
    const [showProfile, setShowProfile] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [showOptInSettings, setShowOptInSettings] = useState(false);
    const [shouldRefreshOptInData, setShouldRefreshOptInData] = useState(false);
    const [userProfileData, setUserProfileData] = useState({});
    const [contribOptInFields, setContribOptInFields] = useState([]);
    const [tableKey, setTableKey] = useState(uuidv4());

    const fetchUserData = async () => {
        const data = await apiClient.get(`users/${tokenManager.getUserId()}`);
        if (data.data) {
            setUserProfileData(data.data.attributes);
        } else {
            console.warn(`An unexpected error occurred ${data}`);
        }
    };

    const fetchContribData = async () => {
        let localUserOptIndata = await apiClient.get(`users/${tokenManager.getUserId()}/payment-opt-in`);
        if (localUserOptIndata.data) {
            localUserOptIndata = localUserOptIndata.data
        } else {
            console.warn(`An unexpected error occurred ${localUserOptIndata}`);
        }

        let localContribFieldData = await apiClient.get(`contribution_fields?opt_in=true`);
        if (localContribFieldData.data) {
            localContribFieldData = localContribFieldData.data;
        } else {
            console.warn(`An unexpected error occurred ${localContribFieldData}`);
        }

        for (let contribField of localContribFieldData) {
            for (let userOptIn of  localUserOptIndata) {
                if (userOptIn.attributes.requested_field_id === contribField.id) {
                    contribField.relationships.userOptIn = userOptIn;
                    break;
                }
            }
        }

        setContribOptInFields(localContribFieldData);
    };

    useEffect(async () => {
        await fetchUserData();
        await fetchContribData();
    }, []);

    useEffect(async () => {
        if (shouldRefreshOptInData) {
            await fetchContribData();
            setShouldRefreshOptInData(false);
        }
    }, [shouldRefreshOptInData]);

    useEffect(() => {
        setTableKey(uuidv4());
    }, [contribOptInFields]);

    const optInRefreshContext = {
        shouldRefreshOptInData: shouldRefreshOptInData,
        setShouldRefreshOptInData: setShouldRefreshOptInData
    };

    return(
        <RefreshOptInDataContext.Provider value={optInRefreshContext}>
            <Fragment>
                <div className="container card" id="user-account">
                    <NavigationTabs setShowProfile={setShowProfile}
                                    setShowSettings={setShowSettings}
                                    setShowOptInSettings={setShowOptInSettings}
                    />

                    {showProfile &&
                        <UserDataComponent setUserProfileData={setUserProfileData}
                                           userProfileData={userProfileData}
                        />
                    }

                    {showSettings &&
                        <UserSettingsComponent setUserProfileData={setUserProfileData}
                                               userProfileData={userProfileData}
                        />
                    }

                    {showOptInSettings &&
                        <MembershipOptInComponent contribOptInFields={contribOptInFields}
                                                  tableKey={tableKey}
                        />
                    }

                    <CustomToaster />
                </div>
            </Fragment>
        </RefreshOptInDataContext.Provider>
    );
};

export default BaseUserProfile;
