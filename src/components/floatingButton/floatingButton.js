import {Fragment, useEffect, useState} from "react";

import "./style.css"
import ReactTooltip from "react-tooltip";

const FloatingButton = ({ buttonType, handleClick, shouldStatus, tooltipText}) => {
    const [displayStatus, setDisplayStatus] = useState(true);

    useEffect(async () => {
        setDisplayStatus(Boolean(shouldStatus));
    }, []);

    const handleOnclick = (event) => {
        event.preventDefault();
        setDisplayStatus(false);
        handleClick()
    };

    return (
        <Fragment>
            {displayStatus &&
                <div id={"floating-button-" + buttonType}
                     className={"floating-button"} data-tip={tooltipText}>
                    <ReactTooltip />
                    <a className="btn btn-floating btn-primary btn-lg" onClick={handleOnclick}>
                        <i className="fas fa-plus" />
                    </a>
                </div>
            }
        </Fragment>
    );

};

export default FloatingButton;

