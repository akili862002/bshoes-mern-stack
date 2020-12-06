import React from 'react';
import "./index.css";
import { Link } from 'react-router-dom';

export default function BlackNavBar({ itemsWithNamesAndLinks, activeItem }) {
    let nameItems = Object.keys(itemsWithNamesAndLinks);
    let Links = itemsWithNamesAndLinks;

    return (
        <div className="black-nav-bar-container">

            {nameItems.map((name) => {
                    let setClass = "";
                    if (name === activeItem) {
                        setClass = "active"
                    }

                    return (
                        <h4 className={setClass} key={"item-black-nav-" + name}>
                            <Link to={Links[name]}>{name}</Link>
                        </h4>
                    );
                }
            )}

        </div>
    );
}