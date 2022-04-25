import {Fragment, useEffect, useState} from "react";


const PageLoader = ({ width, height, marginTop, zIndex }) => {
    const defaultStyle = {
        width: "9rem",
        height: "9rem",
        marginTop: "10rem",
        zIndex: "511"
    };
    const [style, setStyle] = useState(defaultStyle);

    useEffect(() => {
        let localStyle = {...defaultStyle};
        localStyle.width = width ? width : localStyle.width;
        localStyle.height = height ? height : localStyle.height;
        localStyle.marginTop = marginTop ? marginTop : localStyle.marginTop;
        localStyle.zIndex = zIndex ? zIndex : localStyle.zIndex;

        setStyle(localStyle);
    }, []);

    return (
        <Fragment>
            <div className="text-center">
                <div className="spinner-border page-loading-spinner" role="status" style={style}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </Fragment>
    );
};

export default PageLoader;
