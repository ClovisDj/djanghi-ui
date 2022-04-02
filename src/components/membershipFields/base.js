import {Fragment, useEffect, useState} from "react";

import FloatingButton from "../floatingButton/floatingButton";
import SingleContributionDisplay from "./contribCard";

import DataParser from "../../utils/dataParser";
import ApiClient from "../../utils/apiConfiguration";

const apiClient = new ApiClient();

const RowOfThreeContributions = ({ threeContributions }) => {
    const rows = threeContributions.map(item => <SingleContributionDisplay key={item.id} contribution={item} />);

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

     useEffect(async () => {
        const data = await apiClient.get("contribution_fields");
        if (data) {
            const dataParser = await new DataParser(data);
            setContributionFields(dataParser.data);
        }
    }, []);

     const elements = () => {
         let renderedListOfElements = [];
         for (let index=0; index < contributionFields.data.length; index += 4) {
             renderedListOfElements.push(
                <RowOfThreeContributions key={index.toString()}
                                         threeContributions={contributionFields.data.slice(index, index + 4)}
                />
            )
         }
         return renderedListOfElements;
     };

     const handlePlusButtonClick = () => {
        // To Do: add create modal
     };


    return(
        <Fragment>
            {elements()}
            <FloatingButton buttonType={"plus"}
                            handleClick={handlePlusButtonClick}
                            shouldStatus={true} tooltipText={"Add more fields!"}
            />
        </Fragment>
    );
};

export default BaseMembershipFields;
