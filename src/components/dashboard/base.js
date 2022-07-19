import {Fragment} from "react";


const BaseDashboard = ({ ComponentToRender }) => {
    return (
        <Fragment>
            <main id="main" className="main">
                <section className="section">
                    { <ComponentToRender /> }
                </section>
            </main>
        </Fragment>
    );
};

export default BaseDashboard;
