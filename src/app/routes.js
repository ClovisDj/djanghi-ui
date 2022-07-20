import React, {useState} from 'react';
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

const tokenManager = new TokenManager();

const ProtectedRoute = ({ children }) => {
    if (!tokenManager.isAuthenticated()) {
        return <Navigate to="/login" replace={true} />;
    }
    return children;
};

const DjanghiRoutes = () => {
    const [user, setUser] = useState();

    const userContextData = {
        user: user,
        setUser: setUser
    };

  return (
      <BrowserRouter history={history}>
          <UserDataContext.Provider value={userContextData}>
              <NavBar />
              <Routes>
                  <Route path="/dashboard"
                         element={<ProtectedRoute children={<Dashboard />} />}
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/membership-fields"
                         element={<ProtectedRoute children={<MembershipFields />} />}
                  />
                  <Route path="/membership-payments"
                         element={<ProtectedRoute children={<MembershipPayments />} />}
                  />
                  <Route path="/users"
                         element={<ProtectedRoute children={<Users />} />}
                  />
                  <Route path="/my-account"
                         element={<ProtectedRoute children={<UserProfile />} />}
                  />
                  <Route path="/"
                         element={<Navigate replace to="/dashboard"/>}
                  />
                  <Route path="/activated"
                         element={<ActivationLink />}
                  />
                  <Route path="/password-reset"
                         element={<PasswordReset />}
                  />
                  <Route path="*"
                       element={<NotFoundPage />}
                  />
            </Routes>
          </UserDataContext.Provider>
      </BrowserRouter>
)};


export default DjanghiRoutes;
