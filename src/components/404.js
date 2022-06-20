import {Fragment} from "react";
import {useNavigate} from "react-router-dom";

import notFound from '../../public/images/404.svg';

const NotFoundPage = () => {
    let navigate = useNavigate();

    const backHome = (event) => {
        event.preventDefault();
        navigate("/", { replace: true});
    };

    return (
        <Fragment>
            <main>
                <div className="container">

                    <section
                        className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                        <h1>404</h1>
                        <h2>The page you are looking for doesn't exist.</h2>
                        <a className="btn" onClick={backHome}>Back to home</a>
                        <img src={notFound} className="img-fluid py-5" alt="Page Not Found" />
                    </section>

                </div>
            </main>
        </Fragment>
    );
};

export default NotFoundPage;
