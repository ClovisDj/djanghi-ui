import {Fragment, useEffect} from "react";

import {useNavigate, useSearchParams} from "react-router-dom";
import ApiClient from "../../utils/apiConfiguration";
import TokenManager from "../../utils/authToken";
import PageLoader from "../sharedComponents/spinner/pageLoader";

const apiClient = new ApiClient();
const tokenManager = new TokenManager();

const ActivationLink = () => {
    const [activationParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(async () => {
        const activationData = {
        access: activationParams.get("access"),
        refresh: activationParams.get("refresh"),
        };

        tokenManager.storeTokens(activationData);
        if (tokenManager.isAuthenticated()) {
            try {
                const userData = await apiClient.get(`users/${tokenManager.getUserId()}`);
                await tokenManager.storeAuthUser(userData);
                navigate("/dashboard", { replace: true });
            } catch (error) {
                console.warn(`An unexpected error occurred: ${error}`);
            }

        } else {
            navigate("/notFound", { replace: true })
        }
    }, []);

    return (
        <Fragment>
            <PageLoader />
        </Fragment>
    );
};

export default ActivationLink;
