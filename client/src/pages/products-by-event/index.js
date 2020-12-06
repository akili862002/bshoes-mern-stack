import React, { useState, useEffect } from 'react';
import "./index.css";
import axios from 'axios';
import NavBarSelection from '../../components/nav-bar/NavBarSelection';
import Footer from '../../components/Footer';
import Search_bar from './components/search-bar';
import Flash_icon from '../../images/svg/flash.svg';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { LazyLoadImage  } from 'react-lazy-load-image-component';
import RateStar from '../../components/rate-star';
import Top_icon from '../../images/svg/popular.svg';
import Like_icon from '../../images/svg/you-may-like.svg';

let getPrettyTitleFromParams = {
    "flash-sales": {
        name: "Flash Sales",
        icon: Flash_icon
    },
    "most-popular": {
        name: "Most Popular",
        icon: Top_icon
    },
    "you-may-like": {
        name: "You May Like",
        icon: Like_icon
    }
}

// @Route: /products/

export default function ProductsByEventPage({ match }) {
    let event_name = match.params.event;
    let [data, setData] = useState([]);
    let [isDataLoaded, setIsDataLoaded] = useState(false);
    
    useEffect(() => {
        // If user search another text, we need to reset all options and data to inital
        if (isDataLoaded) {
            setData([]);
            setIsDataLoaded(false);
        }
    }, [event_name]);

    // Filter_target change ---
    useEffect(() => {
        setData([]);
        setIsDataLoaded(false);

        axios.get('/api/products/event/' + event_name)
            .then((res) => {
                // console.log('Data loaded!')
                // console.log(res.data);

                setData(res.data);
                setIsDataLoaded(true);
                window.scrollTo(0, 0);
            })
            .catch(err => {
                setIsDataLoaded(true);
                try {
                    console.error(err.response.data);
                    console.error(err);
                } catch (error) {
                    console.error(err);
                }
            })
    }, [event_name]);

    return (
        <React.Fragment >
            <NavBarSelection activeItem="Shoes"/>
            <div className="products-by-event-page main">
                <Search_bar />

                <div className="main-title">
                    <img src={getPrettyTitleFromParams[event_name].icon} className="icon"/>
                    <h3>{getPrettyTitleFromParams[event_name].name}</h3>
                </div>
                <div className="line"></div>

                <div className="main-board">
                    <Products_Display 
                        data={data}
                        search_text={event_name}
                        isLoadingSearchResult = {!isDataLoaded}
                    />
                </div>

            </div>
            <Footer />

        </React.Fragment>
    );
}


function Products_Display({ data, isLoadingSearchResult }) {

    return (
        <div className="products-display-board">
            {
                data.map((product, i) => 
                    <Product 
                        key={'product-card-' + product.name}
                        product={product}
                        isLoadingSearchResult={isLoadingSearchResult}
                    />
                )
            }
        </div>
    );
}


function Product({ product, isLoadingSearchResult}) {
    let { cost, images, name, rate, id_product } = product;
    let image_url = "";
    if (images.smallSize.length > 0)
        image_url = images.smallSize[0].url.replace("URL: ", "");
    
    return (
        <Link to={"/products/product-detail/" + id_product}>
            <div className="card">
                <div className="image">
                    { 
                        !isLoadingSearchResult &&
                            <LazyLoadImage
                                src={image_url}
                                alt={"Image of " + name}
                                effect="blur"
                            />
                    }
                </div>
                <div className="informations">
                    {
                        rate.star ? (
                            <div className="rate-status">
                                <RateStar 
                                    numberStar={rate.star}
                                    sizeEachStar={15}
                                />
                                <p className="number-people-rate">{`(${rate.NumberPeopleRate})`}</p>
                            </div>
                        ) 
                        : <Skeleton height="15px"/>
                    }
                    <div className="name">{name || <Skeleton />}</div>
                    <div className="cost">
                        <div className="current-cost">{ cost.currentCost ? ('$' + cost.currentCost) : <Skeleton width="100px"/>}</div>
                        <div className="real-cost">{cost.discountPersent > 0 && '$' + cost.realCost}</div>
                        <div className="discount-persent">{cost.discountPersent > 0 && `-${(cost.discountPersent*100).toFixed(0)}%`}</div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
