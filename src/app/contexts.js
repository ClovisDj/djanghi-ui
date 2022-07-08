import {createContext} from "react";

export const UserDataContext = createContext({
    user: null,
    setUser: () => {}
});
