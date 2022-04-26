import {Fragment, useState} from "react";
import FloatingButton from "../sharedComponents/floatingButton/floatingButton";
import SecondaryNavBar from "../sharedComponents/secondaryNavBar";


const ListUsersHeaderComponent = ({}) => {
    return (
        <Fragment>
            <div className="row underline" />

            <div className="table-responsive admin-payments-table-header">
                <table className="table">
                    <thead>
                        <tr className="d-flex">
                          <th className="text-start col-6" scope="col">Name</th>
                          <th className="text-end overflow-scroll col-3" scope="col">Registration</th>
                          <th className="text-end overflow-scroll col-3" scope="col">Admin</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </Fragment>
    );
};

const BaseUsersRegistration = ({ }) => {
    const [searchValue, setSearchValue] = useState("");

    const handleOpenRegistrationModal = () => {

    };

    const handleSearch = async (event) => {
        setSearchValue(event.target.value);
    };

    return (
        <Fragment>
            <SecondaryNavBar searchText={searchValue}
                             handleSearch={handleSearch}
                             // handleSelect={handleSelect}
                             TableHeaderComponent={ListUsersHeaderComponent}
            />

            <FloatingButton buttonType={"plus"}
                            handleClick={handleOpenRegistrationModal}
                            shouldDisplay={true}
                            tooltipText={"Register a new member"}
            />
        </Fragment>
    );
};

export default BaseUsersRegistration;
