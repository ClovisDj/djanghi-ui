import {Fragment, useEffect, useState} from "react";
import {isMobile} from "react-device-detect";


const PageLoader = ({ width, height, marginTop, zIndex }) => {
    const defaultStyle = {
        width: "9rem",
        height: "9rem",
        marginTop: "10rem",
    };
    const [style, setStyle] = useState(defaultStyle);
    const [wrapperStyle, setWrapperStyle] = useState({
        zIndex: "999",
        backgroundColor: "none",
        position: "fixed",
        top: "40%",
        left: "58%",
        WebkitTransform: "translate(-50%, -50%)",
        transform: "translate(-50%, -50%)",
    });

    useEffect(() => {
        let localStyle = {...defaultStyle};
        localStyle.width = width ? width : localStyle.width;
        localStyle.height = height ? height : localStyle.height;
        localStyle.marginTop = marginTop ? marginTop : localStyle.marginTop;
        localStyle.zIndex = zIndex ? zIndex : localStyle.zIndex;

        setStyle(localStyle);

        if (isMobile) {
            setWrapperStyle({
                ...wrapperStyle,
                left: "50%",
            });
        }
    }, []);

    return (
        <Fragment>
            <div className="text-center" style={wrapperStyle}>
                <div className="spinner-border page-loading-spinner" role="status" style={style}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </Fragment>
    );
};

export default PageLoader;
