import {createContext} from "react";


export const defaultSelectConfiguration = {
    contribOptions: [],
    selected: {
        label: "",
        value: ""
    },
};

export const ContribSelectContext = createContext(defaultSelectConfiguration);
