import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';

import history from "../browserHistory"
import Login from "../components/homePage/login";
import NotFoundPage from "../components/404";
import Dashboard from "../components/dashboard";
import MembershipFields from "../components/membershipFields";
import MembershipPayments from "../components/membershipPayments";
import Users from "../components/users";
import ActivationLink from "../components/userActivation";
import UserProfile from "../components/userProfile";
import PasswordReset from "../components/homePage/passwordReset";
import NavBar from "../components/navbar/navbar";
import {UserDataContext} from "./contexts";
import TokenManager from "../utils/authToken";


const DjanghiRoutes = () => {
    const [user, setUser] = useState();
    const tokenManager = new TokenManager();
    const userContextData = {
        user: user,
        setUser: setUser
    };

    useEffect(async () => {
        if (!tokenManager.isAuthenticated()) {
            await tokenManager.logOut();
        } else {
            setUser(tokenManager.getAuthUser());
        }
    }, []);

  return (
    <BrowserRouter history={history}>
        <UserDataContext.Provider value={userContextData}>
            <NavBar />
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login/>} />
              <Route path="/membership-fields" element={<MembershipFields />} />
              <Route path="/membership-payments" element={<MembershipPayments />} />
              <Route path="/users" element={<Users />} />
              <Route path="/my-account" element={<UserProfile />} />
              <Route path="/" element={<Navigate replace to="/dashboard"/>} />
              <Route path="/activated" element={<ActivationLink />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </UserDataContext.Provider>
    </BrowserRouter>
)};


export default DjanghiRoutes;
