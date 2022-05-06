import {Fragment, useEffect, useState} from "react";

import FloatingButton from "../sharedComponents/floatingButton/floatingButton";
import SingleContributionDisplay from "./contribCard";
import CreateEditModal from "./createEditModal";

import DataParser from "../../utils/dataParser";
import ApiClient from "../../utils/apiConfiguration";

const apiClient = new ApiClient();

const RowOfThreeContributions = ({ threeContributions, shouldRefreshData, setShouldRefreshData }) => {
    const rows = threeContributions.map(item => <SingleContributionDisplay key={item.id}
                                                                           contribution={item}
                                                                           shouldRefreshData={shouldRefreshData}
                                                                           setShouldRefreshData={setShouldRefreshData} />
    );

    return (
        <Fragment>
            <div className="row">
                {rows}
            </div>
        </Fragment>
    );
};

const BaseMembershipFields = () => {
    const [contributionFields, setContributionFields] = useState({data: []});
    const [showModal, setShowModal] = useState(false);
    const [shouldRefreshData, setShouldRefreshData] = useState("");


    const fetchContribFieldsData = async () => {
        const data = await apiClient.get("contribution_fields");
        if (data) {
            const dataParser = await new DataParser(data);
            setContributionFields(dataParser.data);
        }
    };

     useEffect(async () => {
        await fetchContribFieldsData();
    }, []);

     useEffect(async () => {
        await fetchContribFieldsData();
    }, [shouldRefreshData]);

     const RenderElements = ({ contribData }) => {
         let renderedListOfElements = [];
         for (let index=0; index < contribData.data.length; index += 3) {
             renderedListOfElements.push(
                <RowOfThreeContributions key={index.toString()}
                                         threeContributions={contribData.data.slice(index, index + 3)}
                                         shouldRefreshData={shouldRefreshData}
                                         setShouldRefreshData={setShouldRefreshData}
                />
            )
         }
         return renderedListOfElements;
     };

     const handlePlusButtonClick = async () => {
        await setShowModal(true);
     };


    return(
        <Fragment>
            <RenderElements contribData={contributionFields} />
            <CreateEditModal modalType={"Create a Contribution Field"}
                             showModal={showModal}
                             setShowModal={setShowModal}
                             contribData={null}
                             shouldRefreshData={shouldRefreshData}
                             setShouldRefreshData={setShouldRefreshData}
            />
            <FloatingButton buttonType={"plus"}
                            handleClick={handlePlusButtonClick}
                            shouldDisplay={true}
                            tooltipText={"Add more fields!"}
            />
        </Fragment>
    );
};

export default BaseMembershipFields;
