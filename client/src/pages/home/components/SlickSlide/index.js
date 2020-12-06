import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./index.css";
import "../../../../components/styles/product-show-in-slick-slider.css";
import { add_a_product_to_cart, add_a_product_to_wishlist } from '../../../../redux-handle/actions/user/process_data';

import { Link } from 'react-router-dom';
import SlickSlide from '../../../../components/slick-slide';
// import SlickSlide from '../../../../components/slick-slide/test';

import RateStar from '../../../../components/rate-star';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton from 'react-loading-skeleton';

import {ReactComponent as Heart_icon} from '../../../../images/svg/heart.svg';
import {ReactComponent as Cart_icon} from '../../../../images/svg/cart.svg';
import SaleSign_img from "../../../../images/img/sale-bg.png"
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

export default function SlickSlideComponent(
    { 
        api_link_req, 
        title_nav, 
        link_to_see_more_button,
        isTitleShowed = true,
        isSeeMoreCardAlwaysShowed=false
    }) {
    let dispatch = useDispatch();
    let history = useHistory();
    let isAuthenticated = useSelector(state => state.user_auth.isAuthenticated);
    /*
        Interface
            api_link_req: String (URL)
            title_nav : {
                name: String,
                icon: Image_URL
            }
            link_to_see_more_button: String (URL)
    */
   let [isDataLoaded, setIsDataLoaded] = useState(false);
    let [cards, setCards] = useState(Array(5).fill({
        name: null,
        cost: {
            discountPersent: 0,
            realCost: null,
            currentCost: null
        },
        images: null,
        options: {
            sizes: null,
            color: null
        },
        rate: {
            NumberPeopleRate: null,
            star: null
        }
    }));

    useEffect( () => {
        axios.get(api_link_req)
            .then((res) => {
                setCards(res.data);
                setIsDataLoaded(true);
            })
            .catch((err) => {
                try {
                    // try to show server error
                    if (err.response.data) {
                        console.error("[SERVER ERROR] API: " + api_link_req);
                        console.error(err.response.data.error);
                    }

                } catch (error) {
                    console.error(err);
                }
            })
    }, []);

    return (
        <div className="slick-slide-component">

            {
                isTitleShowed && (
                    <div className="top-bar">
                        <div className="title">
                            <img src={title_nav.icon} />
                            <h2>{title_nav.name}</h2>
                        </div>

                        <Link to={link_to_see_more_button}>
                            <button className="see-more-btn">
                                See more
                            </button>
                        </Link>
                    </div>
                )
            }

            <SlickSlide >
                {
                    cards.map( (card, i) => 
                        <Card 
                            key = {'key-card-slick-ss' + i}
                            card = {card}
                            dispatch={dispatch}
                            history={history}
                            isAuthenticated={isAuthenticated}
                            isDataLoaded={isDataLoaded}
                        />
                    )
                }

                {/* See more card */
                    (window.innerWidth <= 600 || isSeeMoreCardAlwaysShowed) && cards.length >= 5 ? (
                        <Link to={link_to_see_more_button} key={'see-more-btn'}>
                            <div className="see-more-card">
                                <h3>See more</h3>
                            </div>
                        </Link>
                    )
                    : null
                }

            </SlickSlide>
        </div>
    );
}

function Card({ card, dispatch, history, isAuthenticated, isDataLoaded }) {
    let isDiscounting = true;
    if (card.cost.discountPersent === 0) { isDiscounting = false };

    let statusClass;
    if (isDiscounting) {
        statusClass = "discounting"
    } else statusClass = "not-discount"
    let image_url;
    if (card.images != null)
        image_url = card.images.smallSize[0].url.replace("URL:", "");

    function addProductToCart(card) {
        // make sure that user was logged in
        if (!isAuthenticated) {
            history.push('/user/login');
            return;
        }

        let product = {
            id_product: card.id_product,
            number: 1,
            color: card.options.color,
            size: card.options.sizes[0]
        }
        add_a_product_to_cart(product, dispatch)
    }
    function addProductToWishlist(card) {
        // make sure that user was logged in
        if (!isAuthenticated) {
            history.push('/user/login');
            return;
        }

        let product = {
            id_product: card.id_product,
            number: 1,
            color: card.options.color,
            size: card.options.sizes[0]
        }
        add_a_product_to_wishlist(product, dispatch)
    }
    
    return (
        <Link to={`/products/product-detail/${card.id_product}`} key={"slick-sl-" + card.name}>
            <div className="image-box"
                style={{ width: '200px', height: '200px' }}
            >
                {
                    card.images != null && 
                        // <img 
                        //     src={image_url} 
                        //     style={{ width: "200px"}}
                        //     onLoad = {() => setIsImageLoaded(true)}
                        // />
                        <LazyLoadImage 
                            src={image_url}
                            alt={"Image of " + card.name}
                            effect="blur"
                            key={'img-' + card.name}
                            width="200px"
                            height="auto"
                        />
                }
                {!isDataLoaded && <Skeleton width="200px" height="200px"/>}
            </div>

            <div className="rate-product">
                {
                    card.rate.star ?
                        <RateStar numberStar={card.rate.star} sizeEachStar="16px"/>
                    :
                        <Skeleton width="200px"/>
                }
                {card.rate.NumberPeopleRate && <h5 className="number-people-rate">{'(' + card.rate.NumberPeopleRate + ')'}</h5>}
            </div>


            <div className="name-product">{card.name || <Skeleton width="70%"/>}</div>

            <div className={`cost-product ${statusClass}`}>

                <h4 className="current-cost">
                    {card.cost.currentCost ? ("$" + card.cost.currentCost) : <Skeleton width="50px"/>}
                </h4>
                        
                {card.cost.realCost != null && <h4 className="real-cost">{"$" + card.cost.realCost}</h4>}
            </div>

            <div className={`sale-sign ${statusClass}`}>
                {card.cost.discountPersent > 0 && <img src={SaleSign_img} alt=""/>}
                <h5>{card.cost.discountPersent * 100}%</h5>
            </div>

            {
                card.name && (
                    <div className="buttons" onClick={e => e.preventDefault()}>
                        <div className="add-to-favorite btn" onClick={ () => {addProductToWishlist(card)} }>
                            <Heart_icon />
                        </div>

                        <div className="add-to-cart btn" onClick={ () => {addProductToCart(card)} }>
                            <Cart_icon />
                        </div>

                    </div>
                )
            }

        </Link>
    );
}
