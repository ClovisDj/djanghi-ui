import React, {Fragment, useContext, useState} from 'react';

import DjanghiRoutes from "./routes";
import {UserDataContext} from "./contexts";


const App = () => {
    const [user, setUser] = useState();

    return (
        <Fragment>
            <UserDataContext.Provider value={{ user: user, setUser: setUser}}>
                <DjanghiRoutes/>
            </UserDataContext.Provider>
        </Fragment>
    );
}

export default App;

