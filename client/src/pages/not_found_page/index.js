import React from 'react';
import './index.css';
import {Link} from 'react-router-dom';
import NotFoundIcon from '../../images/img/not-found.png';

export default function NotFoundPage() {

    return (
        <div className="container-not-found-page">
            <section className="page-not-found">

                <div className="row">

                    <div className="col-md-6 col-md-offset-1">
                        <div className="page-not-found-main">
                            <img src={NotFoundIcon} alt=""/>
                            <p>Oops!, looks like something went very wrong. This page will be updated soon!</p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <h4 className="heading-primary">You can click <a href="https://www.facebook.com/rengar.the">here</a> to send me a report or <Link to="/">go back to the Home Page</Link></h4>
                    </div>

                </div>

            </section>
        </div>
    );
}