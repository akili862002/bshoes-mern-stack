import React from 'react';
import './index.css';
import { Link } from 'react-router-dom';

export default function MiniDirCurrentPageBar({ dir }) {
    /* Structure variable input
        dir: [
            {site: "", link: ""}
        ]
    */
    return (
        <div className="mini-dir-current-page-bar">
            <div className="current-dir-show">
                {
                    dir.map((item, i) => {
                        let {site, link} = item;
                        if (dir.length === 1 || i === dir.length - 1) 
                            return <Link to={link} key={'dir-s-i-' + i}>{site}</Link>;
                        return (
                            <React.Fragment key={'dir-s-i-' + i} >
                                <Link to={link} >{site}</Link><div style={{margin: "0 20px"}}>|</div>
                            </React.Fragment>
                        );
                    })
                }
            </div>
        </div>
    );

}