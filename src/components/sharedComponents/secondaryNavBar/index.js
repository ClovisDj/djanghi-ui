import {Fragment} from "react";

import BaseSecondaryNavBar from "./base";
import "./index.css"


const SecondaryNavBar = ({ searchText, handleSearch, handleSelect, selectedItem, TableHeaderComponent }) => {
    return (
        <Fragment>
            <BaseSecondaryNavBar handleSearch={handleSearch}
                                 searchValue={searchText}
                                 handleSelect={handleSelect}
                                 selectedItem={selectedItem}
                                 TableHeaderComponent={TableHeaderComponent}
            />
        </Fragment>
    );
};

export default SecondaryNavBar;

