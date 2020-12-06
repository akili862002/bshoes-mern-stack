import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./index.css";

import { Link } from 'react-router-dom';

import Trademark_icon from "../../../../images/svg/trademark.svg";

export default function TrademarkComponent() {
    let [trademarks, setTrademarks] = useState([]);

    useEffect( () => {
        axios.get("/api/public/trademarks")
            .then((res) => {
                let trademarks = res.data.splice(0, 10);
                setTrademarks(trademarks);
            })
            .catch((err) => {
                try {
                    console.error(err.response.data);
                } catch (error) {
                    console.error(err);
                }
            });
    }, []);

    return (
        <div className="trademark-component">
            <div className="top-bar">
                <div className="title">
                    <img src={Trademark_icon} />
                    <h2>Trademarks</h2>
                </div>

                <Link to="/products/trademarks">
                    <button className="see-more-btn">
                        SEE MORE
                    </button>
                </Link>
            </div>

            <div className="trademarks-list">
                {
                    trademarks.map((item, i) => {
                        let trademark = item.trademark;
                        let linkTo = "/search/" + trademark.replace(/ /g, '-');
                        return (
                            <Link to={linkTo} key={'trademark-disp-' + i}>
                                <div className="trademark-item" >{trademark}</div>
                            </Link>
                        );
                    })
                }
            </div>
            
        </div>
    );
}

