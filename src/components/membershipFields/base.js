import {Fragment, useEffect, useState} from "react";
import DataParser from "../../utils/dataParser";
import ApiClient from "../../utils/apiConfiguration";
import TokenManager from "../../utils/authToken";
import AnimatedNumber from "animated-number-react";
import {formatValue} from "../../utils/utils";
import ReactTooltip from "react-tooltip";
import FloatingButton from "../floatingButton/floatingButton";

const apiClient = new ApiClient();
const tokenManager = new TokenManager();


const SingleContributionDisplay = ({ contribution }) => {
    const [name, setName] = useState("");
    const [isRequired, setIsRequired] = useState(true);
    const [canOptIn, setCanOptIn] = useState(true);
    const [requiredAmount, setRequiredAmount] = useState(0);

    useEffect(async () => {
        setName(contribution.attributes.name);
        setIsRequired(contribution.attributes.is_required);
        setCanOptIn(contribution.attributes.member_can_opt_in);
        if (contribution.attributes.required_amount) {
            setRequiredAmount(contribution.attributes.required_amount);
        }
    }, []);

    return (
        <Fragment>
            <div className="col-lg-3">
                <div className="contrib-card">
                    <div className="table-responsive payments-table">
                        <table id="contrib-card" className="table table-borderless latest-payment-table">
                            <tbody>
                                <tr>
                                    <th scope="row" className="card-title text-start">Name:</th>
                                    <td className="payment-info-text text-start">{name}</td>
                                </tr>
                                <tr>
                                    <th scope="row" className="card-title text-start">Is Required:</th>
                                    <td className="text-start">
                                        <div className="form-check form-switch">
                                            <input className="form-check-input"
                                                   type="checkbox"
                                                   checked={isRequired}
                                                   readOnly={true}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" className="card-title text-start">Required Amount:</th>
                                    <td className="text-start no-payment-due">
                                        <h5>{formatValue(requiredAmount)}</h5>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" className="card-title text-start">Can Opt-In:</th>
                                    <td className="text-start">
                                        <div className="form-check form-switch">
                                            <input className="form-check-input"
                                                   type="checkbox"
                                                   checked={canOptIn}
                                                   readOnly={true}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

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
