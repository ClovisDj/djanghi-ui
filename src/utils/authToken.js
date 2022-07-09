import jwt_decode from "jwt-decode";


class TokenManager {
    #authTokenKey;
    #refreshTokenKey;
    #authUser;

    constructor() {
        this.#authTokenKey = "djanghiAuthToken";
        this.#refreshTokenKey = "djanghiRefreshToken";
        this.#authUser = "djanghiAuthUser";
    }

    storeToken = (tokenKey, token) => {
        localStorage.setItem(tokenKey, token);
    }

    storeAuthToken = (token) => {
        this.storeToken(this.#authTokenKey, token);
    }

    storeAuthUser = (userData) => {
        this.storeToken(this.#authUser, JSON.stringify(userData));
    }

    removeStoredToken = (tokenKey) => {
        localStorage.removeItem(tokenKey);
    }

    removeAuthToken = () => {
        this.removeStoredToken(this.#authTokenKey)
    }

    removeRefreshToken = () => {
        this.removeStoredToken(this.#refreshTokenKey)
    }

    removeAuthUser = () => {
        this.removeStoredToken(this.#authUser)
    }

    storeRefreshToken = (token) => {
        this.storeToken(this.#refreshTokenKey, token);
    }

    getStoredAuthToken = () => {
        return localStorage.getItem(this.#authTokenKey);
    }

    getStoredRefreshToken = () => {
        return localStorage.getItem(this.#refreshTokenKey);
    }

    getAuthUser = () => {
        // Don't know why but this object needs to be deserialized twice
        return JSON.parse(localStorage.getItem(this.#authUser));
    }

    decodeToken = (token) => {
        return jwt_decode(token);
    }

    tokenExpirationDate = (token) => {
        const decodedToken = this.decodeToken(token);
        // Multiplied by 1000 since exp is in epoch seconds
        return new Date(decodedToken.exp * 1000);
    }

    authTokenExpirationDate = () => {
        const storedAuthToken = this.getStoredAuthToken();
        return storedAuthToken ? this.tokenExpirationDate(storedAuthToken) : null;
    }

    tokenIsExpired = (token) => {
        return this.tokenExpirationDate(token) <= new Date();
    }

    canRefreshAuthToken = () => {
        return this.getStoredRefreshToken() && !this.tokenIsExpired(this.getStoredRefreshToken());
    }

    shouldRefreshAuthToken = () => {
        const authExpirationDate = this.authTokenExpirationDate();
        return authExpirationDate && authExpirationDate <= new Date();
    }

    storeTokens = (responseData) => {
        this.storeAuthToken(responseData.access);
        this.storeRefreshToken(responseData.refresh);
    }

    getUserId = () => {
        const decoded = this.decodeToken(this.getStoredAuthToken());
        return decoded.user_id;
    }

    logOut = () => {
        this.removeAuthToken();
        this.removeRefreshToken();
        this.removeAuthUser();
    }

    isAuthenticated = () => {
        return (
            (this.getStoredAuthToken() && !this.tokenIsExpired(this.getStoredAuthToken())) ||
            this.canRefreshAuthToken()
        );
    }
}

export default TokenManager;
