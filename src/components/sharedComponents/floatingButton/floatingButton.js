import {Fragment, useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";

import "./style.css"
import ReactTooltip from "react-tooltip";

const FloatingButton = ({ buttonType, handleClick, shouldDisplay, tooltipText}) => {
    const [displayStatus, setDisplayStatus] = useState(true);

    useEffect(async () => {
        setDisplayStatus(Boolean(shouldDisplay));
    }, []);

    const handleOnclick = (event) => {
        handleClick();
    };

    return (
        <Fragment key={uuidv4()}>
            {displayStatus &&
                <div id={"floating-button-" + buttonType}
                     className={"floating-button"} data-tip={tooltipText}>
                    <ReactTooltip html={true} className="custom-tooltip" effect="solid" place="top" />
                    <a className="btn btn-floating btn-primary btn-lg" onClick={handleOnclick}>
                        <i className="fas fa-plus" />
                    </a>
                </div>
            }
        </Fragment>
    );

};

export default FloatingButton;

