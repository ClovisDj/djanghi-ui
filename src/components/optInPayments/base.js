import {Fragment, useEffect, useState} from "react";

import ApiClient from "../../utils/apiConfiguration";
import SecondaryNavBar from "../sharedComponents/secondaryNavBar";
import DataParser from "../../utils/dataParser";
import {ContribSelectContext, defaultSelectConfiguration} from "../membershipPayments/context";


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
    const [optInContribFields, setOptInContribFields] = useState([]);
    const [optInContribFieldOptions, setOptInContribFieldOptions] = useState([]);
    const [selectedContribField, setSelectedContribField] = useState(defaultSelectConfiguration);

    useEffect(() => {
        const execAsync = async () => await fetchOptInContribFields();
        execAsync().catch(
            error => console.warn(`Unexpected error occurred: ${error}`)
        );
    }, []);

    const handleSearch = (event) => {
        setSearchValue(event.target.value);
    // setUsersParams({
    //     ...usersParams,
    //     search: event.target.value,
    // });
    // await resetPaymentPageData();
    };

    const handleSelect = (selection) => {
        // await resetPaymentPageData();

        let localSelectOptions = {
            ...selectedContribField,
            selected: selection
        };

        setSelectedContribField(localSelectOptions);
        // setAdminContribStatusParams({
        //        ...adminContribStatusParams,
        //        contribution_id: localSelectOptions.selected.value,
        // });
    };

    const fetchOptInContribFields = async () => {
        const response = await apiClient.get("contribution_fields", {opt_in: true});
        if (response.data) {
            const dataParser = await new DataParser(response.data);
            let contribArray = [];
            for (let contrib of dataParser.data) {
                contribArray.push({
                    value: contrib.id,
                    label: contrib.attributes.name
                });
            }

            setOptInContribFields(dataParser.data);
            setOptInContribFieldOptions(contribArray);

            const config = {
                contribOptions: contribArray,
                selected: contribArray.length > 0 ? contribArray[0] : {label: "", value: ""},
            };

            // await setAdminContribStatusParams({
            //    ...adminContribStatusParams,
            //    contribution_id: config.selected.value,
            // });

            setSelectedContribField(config);
        }
    };


    return (
        <Fragment>
            <SecondaryNavBar searchText={searchValue}
                             handleSearch={handleSearch}
                             handleSelect={handleSelect}
                             selectedItem={selectedContribField}
                             TableHeaderComponent={ListHeaderComponent}
            />
        </Fragment>
    );
};

export default BaseOptInPayments;
