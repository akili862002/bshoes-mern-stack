import React, { useEffect } from 'react';
import "./home_style.css";

import NavBarSelection from '../../components/nav-bar/NavBarSelection';
import Footer from '../../components/Footer';
import SlickSlideComponent from './components/SlickSlide';

import BiggestCarouselSlide from '../../components/carousel-slide/';
import TrademarkComponent from './components/TrademarkComponent';

import TopStar_icon from "../../images/svg/popular.svg";
import Flash_icon from "../../images/svg/flash.svg";
import HappyHeart_icon from "../../images/svg/you-may-like.svg";

export default function HomePage() {    

    return (
        <React.Fragment>
            <NavBarSelection activeItem="Home"/>

            <div className="main">
                
                <BiggestCarouselSlide />

                <SlickSlideComponent 
                    title_nav = {{
                        name: "Flash Sales",
                        icon: Flash_icon
                    }}
                    api_link_req = "/api/client/slick-slide/flash-sales"
                    link_to_see_more_button = "/products/event/flash-sales"
                />

                <SlickSlideComponent 
                    title_nav = {{
                        name: "Most Popular",
                        icon: TopStar_icon
                    }}
                    api_link_req = "/api/client/slick-slide/most-popular"
                    link_to_see_more_button = "/products/event/most-popular"
                />

                <TrademarkComponent />

                <SlickSlideComponent 
                    title_nav = {{
                        name: "You May Like",
                        icon: HappyHeart_icon
                    }}
                    api_link_req = "/api/client/slick-slide/random-products"
                    link_to_see_more_button = "/products/event/you-may-like"
                />

            </div>
            <Footer />

        </React.Fragment>
    );
}