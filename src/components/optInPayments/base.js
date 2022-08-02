import {Fragment, useState} from "react";

import ApiClient from "../../utils/apiConfiguration";
import SecondaryNavBar from "../sharedComponents/secondaryNavBar";


const apiClient = new ApiClient();

const ListHeaderComponent = ({}) => {
    return (
        <Fragment>
            <div className="row underline" />

            <div className="table-responsive admin-payments-table-header">
                <table className="table">
                    <thead>
                        <tr>
                          <th className="text-start col-6" scope="col">Name</th>
                          <th className="text-start col-3" scope="col">Status</th>
                          <th className="text-end col-3" scope="col">Approved By</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </Fragment>
    );
};

const BaseOptInPayments = () => {
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = async (event) => {
        setSearchValue(event.target.value);
    // setUsersParams({
    //     ...usersParams,
    //     search: event.target.value,
    // });
    // await resetPaymentPageData();
    };

    const handleSelect = async (selection) => {
        // await resetPaymentPageData();
        //
        // let localSelectOptions = {
        //     ...selectConfig,
        //     contribOptions: contribOptions,
        //     selected: selection
        // };
        //
        // setSelectConfig(localSelectOptions);
        // setAdminContribStatusParams({
        //        ...adminContribStatusParams,
        //        contribution_id: localSelectOptions.selected.value,
        // });
    };



    return (
        <Fragment>
            <SecondaryNavBar searchText={searchValue}
                             handleSearch={handleSearch}
                             handleSelect={handleSelect}
                             TableHeaderComponent={ListHeaderComponent}
            />
        </Fragment>
    );
};

export default BaseOptInPayments;