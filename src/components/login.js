import React, {Fragment, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

import TokenManager from "../utils/authToken";
import ApiClient from "../utils/apiConfiguration";

import logo from '../../public/favicon.ico';


const apiClient = new ApiClient();

const Login = () => {
    const [loginError, setLoginError] = useState('');
    const tokenManager = new TokenManager();
    let [loginData, setLoginData] = useState({
        association: "",
        email: "",
        password: ""
    });
    let navigate = useNavigate();
    let location = useLocation();

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

        const data = await apiClient.post("obtain_token", loginData);
        if (data.data) {
            tokenManager.storeTokens(data.data);
            const userData = await apiClient.get(`users/${tokenManager.getUserId()}`);
            await tokenManager.storeAuthUser(JSON.stringify(userData));
            navigate("/dashboard", { replace: true});
        } else {
            setLoginError('No account found, please verify your credentials');
        }
    };

    const handleAssociationChange = (event) => {
        let data = {...loginData, association: event.target.value}
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

    return (
        <Fragment>
            <main>
                <div className="container">

                    <section
                        className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-xl-3 col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                                    <div className="d-flex justify-content-center py-4">
                                        <a className="logo d-flex align-items-center w-auto">
                                            <img src={logo} alt=""></img>
                                                <span className="d-none d-lg-block">Djanghi</span>
                                        </a>
                                    </div>

                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <div className="pt-4 pb-2">
                                                <h3 className="card-title text-center pb-0 fs-4">Login to Your
                                                    Account</h3>
                                            </div>

                                            <form className="row g-3 needs-validation" onSubmit={handleSubmit}>

                                                <div className="col-12">
                                                    <div className="input-group has-validation">
                                                        <input type="text" name="association" className="form-control"
                                                               id="associationLabel" value={loginData.association}
                                                               placeholder="Your Association"
                                                               onChange={handleAssociationChange} required />
                                                        <div className="invalid-feedback">Please enter your association name.
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <div className="input-group has-validation">
                                                        <input type="text" name="username" className="form-control"
                                                               id="yourUsername" value={loginData.email} placeholder="Your email"
                                                               onChange={handleEmailChange} required />
                                                        <div className="invalid-feedback">Please enter your
                                                            username.
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <input type="password" name="password" className="form-control"
                                                           id="yourPassword" required value={loginData.password}
                                                           placeholder="Your Password"
                                                           onChange={handlePasswordChange} />
                                                    <div className="invalid-feedback">Please enter your password!
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <input className="btn btn-primary w-100" type="submit" value="Login" />
                                                </div>
                                                <div className="col-12 error-display">
                                                    {loginError}
                                                </div>
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
        </Fragment>
    );
};

export default Login;
