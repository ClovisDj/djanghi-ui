import React, {Fragment, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

import TokenManager from "../../utils/authToken";
import ApiClient from "../../utils/apiConfiguration";
import logo from '../../../public/favicon.ico';
import CustomToaster, {successToast} from "../sharedComponents/toaster/toastify";


const apiClient = new ApiClient();
const tokenManager = new TokenManager();

const BaseHomePage = ({ isLogIn }) => {
    const [loginError, setLoginError] = useState('');
    const [loginData, setLoginData] = useState({
        association_label: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const location = useLocation();
    const loginTitle = isLogIn ? "Login to Your Account" : "Password Reset";
    const submitValue = isLogIn ? "Login" : "Send Password Reset Link";

    const clearLoginError = () => {
      if (loginError) {
            setLoginError('');
        }
    }

    useEffect(() => {
        if (tokenManager.isAuthenticated()) {
            navigate('/', { replace: true});
        }
    }, [location]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const endPoint = isLogIn ? "obtain_token" : "reset-password";
        const data = await apiClient.post(endPoint, loginData);

        if (isLogIn && data.data) {
            tokenManager.storeTokens(data.data);
            const userData = await apiClient.get(`users/${tokenManager.getUserId()}`);
            await tokenManager.storeAuthUser(JSON.stringify(userData));
            navigate(
                "/dashboard",
                {
                    replace: true,
                    state: {
                        mainLiActiveKey: "M1",
                        user: userData.data
                    }
                }
            );

        } else if (!isLogIn && data.data) {
            successToast("Successfully Sent Password Reset Link !!!");
            setTimeout(() => navigate("/login"), 3000);
        }else {
            setLoginError('Account not found, please verify your credentials.');
        }
    };

    const handleAssociationChange = (event) => {
        let data = {...loginData, association_label: event.target.value}
        setLoginData(data);
        clearLoginError();
    }

    const handleEmailChange = (event) => {
        let data = {...loginData, email: event.target.value}
        setLoginData(data);
        clearLoginError();
    }

    const handlePasswordChange = (event) => {
        let data = {...loginData, password: event.target.value}
        setLoginData(data);
        clearLoginError();
    }

    const goToLogin = (event) => {
        event.preventDefault();
        navigate("/login");
    };

    const goToPasswordReset = (event) => {
        event.preventDefault();
        navigate("/password-reset");
    };

    return (
        <Fragment>
            <main>
                <div className="container">

                    <section
                        className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                                    <div className="d-flex justify-content-center py-4">
                                        <a className="logo d-flex align-items-center w-auto">
                                            <img src={logo} alt=""></img>
                                                <span className="">Djanghi</span>
                                        </a>
                                    </div>

                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <div className="pt-2 pb-2">
                                                <h3 className="login-card-title text-center pb-0 fs-4">
                                                    {loginTitle}
                                                </h3>
                                            </div>

                                            <form className="row g-3 needs-validation spacer" onSubmit={handleSubmit}>

                                                <div className="col-12 spacer">
                                                    <div className="input-group has-validation">
                                                        <input type="text" name="association" className="form-control"
                                                               id="associationLabel" value={loginData.association_label}
                                                               placeholder="Your Association"
                                                               onChange={handleAssociationChange} required />
                                                        <div className="invalid-feedback">
                                                            Please enter your association name.
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-12 spacer">
                                                    <div className="input-group has-validation">
                                                        <input type="text" name="username" className="form-control"
                                                               id="yourUsername" value={loginData.email} placeholder="Your email"
                                                               onChange={handleEmailChange} required />
                                                        <div className="invalid-feedback">Please enter your
                                                            username.
                                                        </div>
                                                    </div>
                                                </div>

                                                {isLogIn &&
                                                    <Fragment>
                                                        <div className="col-12 spacer">
                                                            <input type="password" name="password" className="form-control"
                                                                   id="yourPassword" required value={loginData.password}
                                                                   placeholder="Your Password"
                                                                   onChange={handlePasswordChange} />
                                                            <div className="invalid-feedback">
                                                                Please enter your password!
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <p className="small mb-0">
                                                                <a href="#" onClick={goToPasswordReset}>Forgot Password</a>
                                                            </p>
                                                        </div>
                                                    </Fragment>
                                                }

                                                {!isLogIn &&
                                                    <div className="col-12">
                                                        <p className="small mb-0">
                                                            <a href="#" onClick={goToLogin}>Go Back to Login</a>
                                                        </p>
                                                    </div>
                                                }

                                                <div className="col-12">
                                                    <input className="btn btn-primary w-100"
                                                           type="submit"
                                                           value={submitValue}
                                                           id="login"
                                                    />
                                                </div>

                                                {loginError &&
                                                    <div className="col-12 error-display">
                                                        {loginError}
                                                    </div>
                                                }
                                            </form>

                                        </div>
                                    </div>

                                    <div className="credits">
                                        <div className="copyright">
                                            &copy; Copyright <strong><span>Djanghi</span></strong>.
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </main>
            <CustomToaster />
        </Fragment>
    );
};

export default BaseHomePage;
