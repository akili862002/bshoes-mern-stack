import React from 'react';
import BlackNavBar from './BlackNavBar';
import { blackNavBarItems } from './consts';

export default function NavBarSelection({ activeItem }) {

    return (
        <React.Fragment >

            {/* Nav-bars -----------------*/}
            <BlackNavBar 
                itemsWithNamesAndLinks={blackNavBarItems}
                activeItem = {activeItem}
            />
            
        </React.Fragment>
    );
}