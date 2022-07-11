import {Fragment, useEffect, useState} from "react";

import ApiClient from "../../utils/apiConfiguration";
import TokenManager from "../../utils/authToken";
import CustomToaster from "../sharedComponents/toaster/toastify";
import UserSettingsComponent from "./userSettings";
import UserDataComponent from "./userDataPage";

const apiClient = new ApiClient();
const tokenManager = new TokenManager();

const NavigationTabs = ({ setShowProfile, setShowSettings}) => {
    const handleShowProfile = () => {
        setShowProfile(true);
        setShowSettings(false);
    };

    const handleShowSettings = () => {
        setShowProfile(false);
        setShowSettings(true);
    };

    return (
        <Fragment>
            <div className="row tabs-wrapper">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home"
                                type="button" role="tab" aria-controls="home" aria-selected="true"
                                onClick={() => handleShowProfile()}>
                            Profile
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile"
                                type="button" role="tab" aria-controls="profile" aria-selected="false"
                                onClick={() => handleShowSettings()}>
                            Settings
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
    const [userProfileData, setUserProfileData] = useState({});

    const fetchUserData = async () => {
        const data = await apiClient.get(`users/${tokenManager.getUserId()}`);
        if (data.data) {
            setUserProfileData(data.data.attributes);
        } else {
            console.warn(`An unexpected error occurred ${data}`);
        }
    };

    useEffect(async () => {
        await fetchUserData();
    }, []);


    return(
        <Fragment>
            <div className="container card" id="user-account">
                <NavigationTabs setShowProfile={setShowProfile}
                                setShowSettings={setShowSettings}
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

                <CustomToaster />
            </div>
        </Fragment>
    );
};

export default BaseUserProfile;
