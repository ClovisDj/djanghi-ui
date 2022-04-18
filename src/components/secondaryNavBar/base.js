import {Fragment} from "react";
import Select from "react-select";
import {ContribSelectContext} from "../membershipPayments/context";


const BaseSecondaryNavBar = ({ searchValue, handleSearch, handleSelect, TableHeaderComponent }) => {
    const blueColor = "rgba(65,84,241,0.8)";
    const whiteColor = "#fff";

    const customStyles = {
        color: whiteColor,
        option: (base, state) => ({
            ...base,
            color: state.data === state.selectProps.value ? whiteColor : "black",
            background: state.data === state.selectProps.value ? blueColor : whiteColor,
            '&:hover': {
            color: whiteColor,
            background: blueColor
            }
        }),
        singleValue: (provided) => ({
            ...provided,
            color: whiteColor,
            background: blueColor,
            paddingLeft: "8px !important",
            borderRadius: "6px",
            padding: "2px"
        }),
    };

    return (
        <Fragment>
            <nav className="bd-subnavbar py-2" aria-label="Secondary navigation">
                <div className="container-xxl d-flex align-items-md-center search-options">
                    <form className="bd-search position-relative">
                        <span className="algolia-autocomplete">
                            <input type="search"
                                   className="form-control ds-input"
                                   id="search-input"
                                   placeholder="Search ..."
                                   value={searchValue ? searchValue : ""}
                                   onChange={handleSearch}
                            />
                        </span>
                    </form>
                    {handleSelect &&
                        <ContribSelectContext.Consumer>
                            {({ contribOptions, selected }) => (
                                <div className="container-xxl d-flex dropdown-contrib">
                                    <Select className={"select-contrib"}
                                            styles={customStyles}
                                            onChange={handleSelect}
                                            options={contribOptions}
                                            value={selected ? selected: {label: "", value: ""}}
                                    />
                                </div>
                            )}
                        </ContribSelectContext.Consumer>
                    }
                </div>

                {TableHeaderComponent &&
                    <TableHeaderComponent />
                }
            </nav>
        </Fragment>
    );
};

export default BaseSecondaryNavBar;
