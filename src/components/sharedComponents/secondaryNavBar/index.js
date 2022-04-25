import {Fragment} from "react";

import BaseSecondaryNavBar from "./base";
import "./index.css"


const SecondaryNavBar = ({ searchText, handleSearch, handleSelect, TableHeaderComponent }) => {
    return (
        <Fragment>
            <BaseSecondaryNavBar handleSearch={handleSearch}
                                 searchValue={searchText}
                                 handleSelect={handleSelect}
                                 TableHeaderComponent={TableHeaderComponent}
            />
        </Fragment>
    );
};

export default SecondaryNavBar;

