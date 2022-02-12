import React, {Fragment, useState,} from 'react';

import SideNavBar from "./components/navbar/sideNavBar";
import TopNavBar from "./components/navbar/topNavBar";


const App = () => {
    const toggleMenuClass = 'toggle-sidebar';
    const [className, setClassName ] = useState('');
    const handleToggleMenuClick = (e) => {
        (className === toggleMenuClass)? setClassName('') : setClassName(toggleMenuClass);
        e.preventDefault();
    };
    return (
        <React.StrictMode>
            <Fragment>
                <div className={className}>
                    <TopNavBar handleToggleMenu={handleToggleMenuClick}/>
                    <SideNavBar/>
                </div>
            </Fragment>
        </React.StrictMode>

    );
}

export default App;

