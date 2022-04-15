import {Fragment, useEffect, useState} from "react";
import SecondaryNavBar from "../secondaryNavBar";
import ApiClient from "../../utils/apiConfiguration";
import DataParser from "../../utils/dataParser";
import {ContribSelectContext, defaultSelectConfiguration} from "./context";


const apiClient = new ApiClient();

const ListHeaderComponent = ({}) => {
    return (
        <Fragment>
            <div className="row underline" />
                <div className="table-responsive admin-payments-table-header">
                    <table className="table">
                        <thead>
                            <tr>
                              <th scope="col">Fist Name</th>
                              <th scope="col">Last Name</th>
                              <th scope="col">Balance</th>
                            </tr>
                        </thead>
                    </table>
                </div>
        </Fragment>
    );
};

const BaseMembershipPayments = () => {
    const [searchValue, setSearchValue] = useState("");
    const [selectConfig, setSelectConfig] = useState(defaultSelectConfiguration);
    const [contribData, setContribData] = useState([]);

    useEffect(async () => {
        const data = await apiClient.get("contribution_fields");
        if (data) {
            const dataParser = await new DataParser(data);
            let contribArray = [];
            for (let contrib of dataParser.data.data) {
                contribArray.push({
                    value: contrib.id,
                    label: contrib.attributes.name
                });
            }

            setContribData(contribArray);

            const config = {
                contribOptions: contribArray,
                selected: contribArray.length > 0 ? contribArray[0] : {label: "", value: ""},
            };
            setSelectConfig(config);
        }
    }, []);

    const handleSearch = (event) => {
        setSearchValue(event.target.value);
    };

    const handleSelect = (selection) => {
        let localSelectOptions = {
            ...selectConfig,
            contribOptions: contribData,
            selected: selection
        };
        setSelectConfig(localSelectOptions);
    };

    return (
        <ContribSelectContext.Provider value={selectConfig}>
            <Fragment>
                <SecondaryNavBar searchText={searchValue}
                                 handleSearch={handleSearch}
                                 handleSelect={handleSelect}
                                 TableHeaderComponent={ListHeaderComponent}
                />
            </Fragment>
        </ContribSelectContext.Provider>
    );
};

export default BaseMembershipPayments;